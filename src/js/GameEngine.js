class GameEngine {
    constructor(levelNumber) {
        this.levelNumber = levelNumber
        this.loadLevel()

        this.wUser = new Array(this.numPics, this.numPics) // matrix der userwauswahl
        //inserting dummy-values into wUser - zeros
        for (let i = 0; i < this.numPics; i++) {
            this.wUser[i] = []
            for (let j = 0; j < this.numPics; j++)
                this.wUser[i][j] = 0
        }
        this.userImagesPixels = new Array(this.numPics, this.width * this.height * 4) // kombinierte pixel der userauswahl = Zielbild
        this.correctUserCombinations = new Array(this.numPics) // 1 wenn richtige kombination, 0 wenn falsch

        let targetImages = new Array(this.numPics)
        let basisImages = new Array(this.numPics)

        for (let i = 0; i < targetImages.length; i++)
            targetImages[i] = new Image()
        for (let i = 0; i < basisImages.length; i++)
            basisImages[i] = new Image()

        this.targetImages = targetImages
        this.basisImages = basisImages

        //this.m = new Array(undefined, undefined)
        //this.mInv = []
        //this.targetPixels = new Array(undefined, undefined)

        // TODO: delete basisPixels3 (?), don't need RGB channel
        //this.basisPixels3 = new Array(undefined, undefined, undefined) // [Bildnummer][Position][Kanal]
        //this.basisPixels = new Array(undefined, undefined)

        //this.width = undefined
        //this.height = undefined

        this.maxWeight = 1 // 0.51, 0.71.. 2.01
        this.clickCounter = 0
        this.totalScore = 0

        this.getTargetAndBasisImages()
    }

    updateOnClick(row, col) {
        this.clickCounter += 1

        // 1. update the value in the user matrix wUser[][]
        if (this.wUser[row][col] == 1)
            this.wUser[row][col] = 0
        else this.wUser[row][col] = 1

        // 2. hole die Reihenmatrix der Userauswahl für die veränderte / angeklickte Zeile
        let wUserRow = new Array(this.numPics)
        wUserRow = this.wUser[row] // bspw.: wUserRow[1, 0, 1]

        // 3. berechne das aktuelle Zielbild, ausgehend von der Userauswahl und zeichne es
        let currentUserImg = new Array()
        currentUserImg = this.calculateUserImage(wUserRow, row) // returned pixel array
        this.drawUserImage(row, currentUserImg)

        // 4. check if the row is now completed; the right result in this row
        let state = this.comparePictures(row, wUserRow) // vergleiche die matrizen (user auswahl und lösungsmatrix)
        if (state == true)
            this.setCorrectCombination(row, true) //richtige Kombination
        else this.setCorrectCombination(row, false) //falsche Kombination

        // 5. check if all rows are finished / have the correct combinations => next level
        let correctCombs = this.getAmountOfCorrectCombinations()
        console.log("Total amount of correct combinations: " + correctCombs.toString() + " of " + this.numPics)
        if (correctCombs == this.numPics) {
            console.log("Level completed with " + this.clickCounter + " clicks!")
            let levelScore = this.returnScore(this.clickCounter)
            this.totalScore += levelScore
            console.log("Score: " + this.totalScore.toString())
            $('#js-game-score').html("Score: " + this.totalScore.toString())
            this.levelNumber += 1
            this.clearArrays()
            this.loadLevel()
            this.getTargetAndBasisImages()
            this.clearGUI()
        }
    }

    getTargetAndBasisImages() {
        // lade die grundlegenden Bilder (aus dem pics Ordner oder mit dem generator)
        let images = new Images()
        images.numImage = this.numPics
        images.position = this.doGenerate // set position of target images (tell Images class where to draw)

        // für die ersten 3 Level generierte Bilder nehmen, danach wieder die Images aus dem Ordner 

        if (this.doGenerate == true) {
            if (this.levelNumber < 3){
                this.targetImages = images.generatedImages // ImageGenerator Bilder
                this.targetPixels = images.targetPixels
                this.width = this.targetImages[0].width
                this.height = this.targetImages[0].height
                this.calculateBasisAndTargetImages()
            } else {
                images.folderImages(function (targetImages, targetPixels) {
                    console.log("Image in callback:", images)
                    this.targetImages = targetImages
                    this.targetPixels = targetPixels
                    console.log("Targetpixels in callback:", images.targetPixels)
                    this.width = this.targetImages[0].width
                    this.height = this.targetImages[0].height
                    this.calculateBasisAndTargetImages()
                }.bind(this)) // Bilder aus pics Ordner
            }
        } else {
            // read basis images
            if (this.levelNumber < 0)
                this.basisImages = images.generatedImages // ImageGenerator Bilder
            else this.basisImages = images.folderImages // Bilder aus image_sets Ordner

            this.basisPixels = images.targetPixels // delete?
            this.width = this.basisImages[0].width
            this.height = this.basisImages[0].height
        }
    }

    calculateBasisAndTargetImages() {
        if (this.doGenerate == true) { // generate basis from input images
            this.findCombinations() // finde eine Konfiguration m mit Zeilensummen von mInv > 0
            this.basisPixels = new Array(this.numPics, undefined) // [numPics][pixel]

            for (let i = 0; i < this.numPics; i++) {
                this.basisPixels[i] = this.blendTargetAndBasisImagesPixels(this.targetPixels, this.mInv[i])
                this.drawImagesInCanvas(this.basisPixels[i], i)
            }
        } else {
            /*
                        // TODO: this calculation is still not finished!
                        this.mInv = new Array(this.numPics, this.numPics)
                        //let pixelsBasis = Array(this.numPics, this.width * this.height * 4) // TODO: * 4 ? // int[][] pixelsBasis = new int[numPics][width*height];
                        this.basisPixels = new Array(this.numPics, this.width * this.height * 4) // [numPics][pixels]

                        for (let i = 0; i < this.numPics; i++) {
                            this.mInv[i][i] = 1 //1./numOnes;
                            this.basisPixels3 = new Array(this.numPics, undefined, undefined) // basisPixels3 = new double[numPics][][]; 

                            this.basisImages[i] = this.calculateGetRGB(this.basisPixels[i]) // maybe don't need the images[] arrays at all
                            this.basisPixels[i] = this.basisImages[i] // get the pixels from basis image

                            // get the pixel array of the basisImages
                            //basisImages[i].getRGB(0, 0, width, height, pixelsBasis[i], 0, width);
                            //this.basisImages[i] = pixelBasis[i] // TODO: not sure?
                        }
                        for (let i = 0; i < this.numPics; i++) {
                            this.basisPixels3[i] = this.blendPixelsTo3DDoubleImage(this.basisPixels, this.mInv[i]) // liefert nur 3 Kanäle RGB zurück
                        }
                        this.generateRandomM()*/
            // IN WORK
            this.findCombinations()
            this.targetPixels = new Array(this.numPics, undefined) // [numPics][pixel]

            for (let i = 0; i < this.numPics; i++) {
                this.targetPixels[i] = this.blendTargetAndBasisImagesPixels(this.basisPixels, this.m[i])
                this.drawImagesInCanvas(this.targetPixels[i], i)
            }
            // IN WORK
            /*
            this.targetPixels = new Array(this.numPics, this.width * this.height * 4)

            for (let i = 0; i < targetPixels.length; i++) {

                this.targetPixels[i] = this.blendPixelsToPixels(this.basisPixels, this.mInv[i])
                this.drawImagesInCanvas(this.targetPixels[i], i + 1)

                //this.targetPixels[i] = this.blend3DDoubleToPixels(this.basisPixels3, this.m[i])
            }*/
        }

        this.printResult()
    }

    drawImagesInCanvas(calculatedImgData, index) {
        // draw the calcuated basis / target images into the canvas gui, only have to be done once for each level
        try {
            let canvas
            if (this.doGenerate == true) // wohin sollen bilder gemalt werden?
                canvas = document.getElementById("js-basis-image-" + index.toString())
            else canvas = document.getElementById("js-starting-image-" + index.toString())
            let ctx = canvas.getContext("2d")
            canvas.width = this.width
            canvas.height = this.height
            let imgData = ctx.getImageData(0, 0, canvas.width, canvas.height)
            imgData.data.set(calculatedImgData)
            ctx.putImageData(imgData, 0, 0)
        } catch (err) {
            console.log("Could not draw images into canvas.", err.message)
        }
    }

    drawUserImage(row, imgPixels) { // welche Reihe und wie sieht das Bild aktuell aus
        // dieses Bild verändert sich mit jedem Klick auf die Matrix, heißt es wird immer neu angezeigt
        let pos = parseInt(row) // für index.html ID
        try {
            let canvas = document.getElementById("js-user-image-" + pos.toString())
            let ctx = canvas.getContext("2d")
            canvas.width = this.width
            canvas.height = this.height
            let imgData = ctx.getImageData(0, 0, canvas.width, canvas.height)
            imgData.data.set(imgPixels)
            ctx.putImageData(imgData, 0, 0)
        } catch (err) {
            console.log("Could not draw user image into canvas.", err.message)
        }
    }

    calculateUserImage(wUserRow, index) {
        // berechnet das Ergebnisbild basierend auf der Matrixauswahl des Users - muss für jede Reihe einzelnd aufgerufen werden 
        console.log("calculateUserImage()")
        let pixelsBlended = this.blendPixelsToPixels(this.basisPixels, wUserRow) // TODO: another Method for blendPixelsToPixels (User)
        this.userImagesPixels[index] = pixelsBlended
        return pixelsBlended
    }

    loadLevel() {
        // load the settings for a specific level
        this.level = new Level(this.levelNumber)
        this.numPics = this.level.numPics
        this.numOnes = this.level.numOnes
        // true: generiere Basisbilder, die die gelesenen Eingangsbilder erzeugen
        // false: verwende die Bilder als Basisbilder und erzeuge Kombinatioen
        this.doGenerate = this.level.doGenerate()
    }

    clearArrays() {
        this.wUser = new Array(this.numPics, this.numPics)
        this.userImagesPixels = new Array(this.numPics, this.width * this.height * 4) // kombinierte pixel der userauswahl = Zielbild
        this.correctUserCombinations = new Array(this.numPics)
        let length = this.width * this.height * 4
        for (let i = 0; i < this.numPics; i++) {
            // reset wUser matrix
            this.wUser[i] = []
            for (let j = 0; j < this.numPics; j++)
                this.wUser[i][j] = 0
            this.setCorrectCombination(i, false)

            // reset images by user (right side) and the amount of correct combinations
            this.userImagesPixels[i] = []
            for (let j = 0; j < length; j++)
                this.userImagesPixels[i][j] = 0

            //reset correct combinations
            this.drawUserImage(i, this.userImagesPixels[i])
            this.correctUserCombinations[i] = 0
        }
        this.clickCounter = 0 // resets clickCounter
    }

    clearGUI() {
        $('.js-card').each(function () {
            $(this).removeClass('js-is-flipped')
        })
        $('#level-headline').html('Level ' + (this.levelNumber + 1).toString())
    }

    returnScore(clicks) {
        let score = 0
        let maximum = this.level.clickMaximum
        let optimum = this.level.clickOptimum
        let fullScoreLimit = 2 * optimum

        if (clicks == optimum || clicks <= fullScoreLimit)
            score = 100
        else if (clicks < maximum && clicks > fullScoreLimit) {
            // abgestuft weniger Punktzahlen
            let count = clicks - optimum
            let schritte = (100.0 - fullScoreLimit) / maximum
            score = 100 - (schritte * count)
        } else if (clicks > maximum)
            score = 0
        return Math.floor(score)
    }

    comparePictures(index, wUserRow) {
        // compare the combination by the user (wUser) with the solution matrix m
        let equals = false
        for (let i = 0; i < this.numPics; i++) {
            if (wUserRow[i] == this.m[index][i])
                equals = true
            else return false
        }
        return equals
    }

    findCombinations() {
        let success
        let tries = 0
        do {
            this.generateRandomM()
            success = true
            this.mInv = InverseMatrix.invert(this.m)
            console.log("Inverted Matrix:", this.mInv)
            for (let i = 0; i < this.mInv.length; i++) {
                for (let j = 0; j < this.mInv[i].length; j++) {
                    let val = this.mInv[i][j]
                    if (!isFinite(val) || isNaN(val))
                        success = false // wenn Rang zu klein ist
                    else if (Math.abs(val) > this.maxWeight) // kein Bild stärker als mit maxContribution gewichten
                        success = false
                }
            }
        } while (!success && tries++ < 10000)
        if (!success)
            throw new Error("Impossible Settings, aborting")
    }

    generateRandomM() {
        let success
        while (!success) {
            this.m = new Array(this.numPics, this.numPics)
            //insert dummy-values into m; insert 0
            for (let i = 0; i < this.numPics; i++) {
                this.m[i] = [];
                for (let j = 0; j < this.numPics; j++)
                    this.m[i][j] = 0
            }
            for (let i = 0; i < this.numPics; i++) {
                for (let j = 0; j < this.numOnes; j++) {
                    let index
                    do index = Math.floor(Math.random() * this.numPics)
                    while (this.m[i][index] == 1)
                    this.m[i][index] = 1
                }
            }
            success = true
            for (let i = 0; i < this.numPics; i++) {
                for (let j = i + 1; j < this.numPics; j++) {
                    let same = true; // identische Kombinationen/Zeilen vermeiden
                    for (let k = 0; k < this.numPics; k++)
                        if (this.m[i][k] != this.m[j][k])
                            same = false
                    if (same) {
                        success = false
                        break
                    }
                }
            }
        }
    }

    blendPixelsToPixels(pixelsIn, w) {
        // w[i] sind gewichte - nehme ich das Bild (ja oder nein?)
        // fi damit verschiebt man die Werte zum Zerolevel (-128)
        // fi damit verschiebt man die Werte zum Zerolevel (-128)
        console.log("blendPixelsToPixels()")
        let pixels = new Array(pixelsIn[0].length)
        for (let i = 0; i < pixels.length; i += 4) { // i läuft gegen width * height * 4, also i+=4
            let r = 0
            let g = 0
            let b = 0
            let a = 0
            for (let j = 0; j < pixelsIn.length; j++) { // nicht j+=4, j läuft gegen numPics
                let rj = this.f(pixelsIn[j][i + 0]) // f((cj >> 16) & 255)
                let gj = this.f(pixelsIn[j][i + 1]) // f((cj >>  8) & 255)
                let bj = this.f(pixelsIn[j][i + 2]) // f((cj      ) & 255)
                //let aj = this.f(pixelsIn[j][i + 3])
                r += w[j] * rj
                b += w[j] * bj
                g += w[j] * gj
                //a += aj // keine Gewichtung (Multiplikation) der Transparenz
            }
            // begrenzung zwischen 0 und 255
            r = Math.min(Math.max(0, this.fi(r)), 255)
            g = Math.min(Math.max(0, this.fi(g)), 255)
            b = Math.min(Math.max(0, this.fi(b)), 255)
            a = 255
            pixels[i + 0] = Math.floor(r)
            pixels[i + 1] = Math.floor(g)
            pixels[i + 2] = Math.floor(b)
            pixels[i + 3] = a // sollte immer a = 255 sein
        }
        return pixels
    }

    blendTargetAndBasisImagesPixels(pixelsIn, w) {
        // w[i] sind gewichte - nehme ich das Bild (ja oder nein?)
        // fi damit verschiebt man die Werte zum Zerolevel (-128)
        let pixels = new Array(pixelsIn[0].length)
        let rMin = 0
        let rMax = 255
        let gMin = 0
        let gMax = 255
        let bMin = 0
        let bMax = 255
        for (let i = 0; i < pixels.length; i += 4) { // i läuft gegen width * height * 4, also i+=4
            let r = 0
            let g = 0
            let b = 0
            let a = 0
            for (let j = 0; j < pixelsIn.length; j++) { // nicht j+=4, j läuft gegen numPics
                let rj = this.f(pixelsIn[j][i]) // f((cj >> 16) & 255)
                let gj = this.f(pixelsIn[j][i + 1]) // f((cj >>  8) & 255)
                let bj = this.f(pixelsIn[j][i + 2]) // f((cj      ) & 255)
                //let aj = this.f(pixelsIn[j][i + 3])
                r += w[j] * rj
                b += w[j] * bj
                g += w[j] * gj
                //a += aj // keine Gewichtung (Multiplikation) der Transparenz
            }
            r = this.fi(r)
            g = this.fi(g)
            b = this.fi(b)

            if (r > rMax) rMax = r
            if (r < rMin) rMin = r
            if (g > gMax) gMax = g
            if (g < gMin) gMin = g
            if (b > bMax) bMax = b
            if (b < bMin) bMin = b
        }

        let max = Math.max(rMax, gMax, bMax)
        let min = Math.min(rMin, gMin, bMin)

        for (let i = 0; i < pixels.length; i += 4) { // i läuft gegen width * height * 4, also i+=4
            let r = 0
            let g = 0
            let b = 0
            let a = 0
            for (let j = 0; j < pixelsIn.length; j++) { // nicht j+=4, j läuft gegen numPics
                let rj = this.f(pixelsIn[j][i]) // f((cj >> 16) & 255)
                let gj = this.f(pixelsIn[j][i + 1]) // f((cj >>  8) & 255)
                let bj = this.f(pixelsIn[j][i + 2]) // f((cj      ) & 255)
                let aj = this.f(pixelsIn[j][i + 3])
                r += w[j] * rj
                b += w[j] * bj
                g += w[j] * gj
                //a += aj // keine Gewichtung (Multiplikation) der Transparenz
            }
            r = this.fi(r)
            g = this.fi(g)
            b = this.fi(b)
            //a = this.fi(a)
            r = (r - min) * 255 / (max - min)
            g = (g - min) * 255 / (max - min)
            b = (b - min) * 255 / (max - min)
            //a = (a - min) * 255 / (max - min)
            pixels[i + 0] = Math.floor(r)
            pixels[i + 1] = Math.floor(g)
            pixels[i + 2] = Math.floor(b)
            pixels[i + 3] = 255
        }
        return pixels
    }

    f(val) {
        let zeroLevel = 128
        return val - zeroLevel
    }

    fi(val) {
        let zeroLevel = 128
        return (val + zeroLevel)
    }

    getAmountOfCorrectCombinations() {
        let correctCombinations = 0
        for (let i = 0; i < this.correctUserCombinations.length; i++) {
            if (this.correctUserCombinations[i] > 0)
                correctCombinations++
        }
        return correctCombinations
    }

    setCorrectCombination(index, value) {
        if (value == true)
            this.correctUserCombinations[index] = 1
        else this.correctUserCombinations[index] = 0
    }

    getUserMatrixValue(row, col) {
        return this.wUser[row][col]
    }

    setUserMatrixValue(row, col, value) {
        this.wUser[row][col] = value
    }

    printResult() {
        console.log("Lösung:", this.m)
        console.log("Zusammensetzung der Basisbilder aus den Eingangsbildern:", this.mInv)
    }















    
    blendPixelsTo3DDoubleImage(pixelsIn, w) { // TODO: need this?
        //Java: private double[][] blendPixelsTo3DDoubleImage(int[][] pixelsIn, double[] w)
        let pixels = new Array(pixelsIn[0].length, 3)
        for (let i = 0; i < pixels.length; i += 4) { // += 4, läuft durch alle Pixel
            let r = 0
            let g = 0
            let b = 0
            let a = 0
            for (let j = 0; j < pixelsIn.length; j++) { // nicht +=4, läuft gegen numPics
                let rj = this.f(pixelsIn[j][i + 0]) // f((cj >> 16) & 255)
                let gj = this.f(pixelsIn[j][i + 1]) // f((cj >>  8) & 255)
                let bj = this.f(pixelsIn[j][i + 2]) // f((cj      ) & 255)
                let aj = this.f(pixelsIn[j][i + 3]) // f((cj >> 24) & 255)
                r += w[j] * rj
                g += w[j] * gj
                b += w[j] * bj
                a += aj // Transparenz wird nicht extra multipliziert / gewichtet
            }
            pixels[i+0] = this.fi(r)
            pixels[i+1] = this.fi(g)
            pixels[i+2] = this.fi(b)
            pixels[i+3] = this.fi(a) //volle Transparenz, a = 255
        }
        return pixels
    }

}
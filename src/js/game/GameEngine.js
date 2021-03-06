/*
 * Autoren: Dennis Loska, Luisa Kurth
 */

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
        this.maxWeight = 1 // 0.51, 0.71.. 2.01
        this.clickCounter = 0
        this.totalScore = 0 // score for all levels in total
        this.levelScore = 0 // score per level
        this.timeNeeded = 0 // time needed for one level
        this.loadImagesIntoLevel()
    }

    updateOnClick(row, col) {
        // 0. Track clicks
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
        currentUserImg = this.calculateUserImage(wUserRow, row) // returns pixel array
        this.drawUserImage(row, currentUserImg)

        // 4. check if the row is now completed; the right result in this row
        let valid = 'img/valid.png'
        let invalid = 'img/invalid.png'
        let state = this.comparePictures(row, wUserRow) // vergleiche die matrizen (user auswahl und lösungsmatrix)
        if (state == true) {
            this.setCorrectCombination(row, true) //richtige Kombination
            $('#js-validation-image-' + row.toString()).attr("src", valid)
        } else {
            this.setCorrectCombination(row, false) //falsche Kombination
            $('#js-validation-image-' + row.toString()).attr("src", invalid)
        }

        // 5. check if all rows are finished / have the correct combinations => next level
        let correctCombs = this.getAmountOfCorrectCombinations()
        if (correctCombs == this.numPics) {
            unbindTile()
            this.endTime = this.getTime()
            this.timeNeeded = this.endTime - this.startTime

            // return score 
            this.levelScore = getPoints()
            if(this.levelScore < 0){
                this.levelScore = 0
            }
            if(this.levelScore > 100){
                this.levelScore = 100
            }
            this.totalScore += this.levelScore

            // return stars 
            let stars = 0
            if (points >= 100 * 2 / 3) {
                stars = 3
            } else if (points < 100 * 2 / 3 && points >= 100 * 1 / 3) {
                stars = 2
            } else if (points < 100 * 1 / 3) {
                stars = 1
            } else if (points == 0) {
                stars = 0
            }
            this.stars = stars

            this.levelNumber += 1
            
            if (this.levelScore <= 0) {
                this.failed = true
                showFailedMenu()
            } else {
                this.failed = false
                showMenu()
            }

            changeButtonBackground()
            stopTimer()
            setStars(this)
            setScoreAndTime(this)
            this.nextLevelClicked()
        }
    }

    nextLevelClicked() {
        // next level button clicked
        $('#btn-next-lvl').click(function () {
            let correctCombs = this.getAmountOfCorrectCombinations()
            if (correctCombs == this.numPics) {
                counter = 0
                this.loadLevel()
                loadGameGUI(this, this.levelNumber)
                clickedTile(this)
                resetStars(this)
                resetChange()
                resetScoreAndTime(this)
                this.clearArrays()
                this.loadImagesIntoLevel()
                clearGUI(this)
            }
        }.bind(this))
    }

    loadImagesIntoLevel() {
        // lade die grundlegenden Bilder (aus dem pics Ordner oder mit dem generator)

        let images = new Images(this.level.grayState)
        images.numImage = this.numPics
        images.position = this.doGenerate // set position of target images (tell Images class where to draw)
        images.emptyState = this.level.emptyState
        images.similarPositions = this.level.shapesPosition

        let useFolderImage = this.level.folderImageUse // defines use of folder images or generated images

        if (this.doGenerate == true) {
            if (!useFolderImage) {
                // generated images
                images.generatedImages
                this.targetPixels = images.targetPixels
                this.width = images.images[0].width
                this.height = images.images[0].height
                this.calculateImages()
            } else {
                // folder images 
                images.folderImages(function (targetPixels) {
                    this.targetPixels = targetPixels
                    this.width = images.images[0].width
                    this.height = images.images[0].height
                    this.calculateImages()
                }.bind(this)) // Bilder aus pics Ordner
            }
        } else {
            // read basis images
            if (!useFolderImage) {
                // generated images 
                images.generatedImages
                this.basisPixels = images.targetPixels
                this.width = images.images[0].width
                this.height = images.images[0].height
                this.calculateImages()
            } else {
                // folder images 
                images.folderImages(function (basisPixels) {
                    this.basisPixels = basisPixels
                    this.width = images.images[0].width
                    this.height = images.images[0].height
                    this.calculateImages()
                }.bind(this)) // Bilder aus pics Ordner
            }
        }
    }

    calculateImages() {
        if (this.doGenerate == true) { // generate basis from input images
            this.findCombinations() // finde eine Konfiguration Matrix m mit Zeilensummen von mInv > 0

            this.basisPixels = new Array(this.numPics, undefined) // pixels of basis images [numPics][pixel]
            this.basisPixels3 = new Array(this.numPics, undefined) // use for user calculation later

            for (let i = 0; i < this.numPics; i++) {
                this.basisPixels3[i] = this.blendPixelsTo3DDoubleImage(this.targetPixels, this.mInv[i])
                this.basisPixels[i] = this.blendTargetAndBasisImagesPixels(this.targetPixels, this.mInv[i])
                this.drawImagesInCanvas(this.basisPixels[i], i)
            }
        } else {
            this.targetPixels = new Array(this.numPics, undefined) // [numPics][pixel]
            this.basisPixels3 = new Array(this.numPics, undefined)

            this.mInv = new Array(this.numPics, this.numPics)
            // fill with zeros first
            for (let i = 0; i < this.numPics; i++) {
                this.mInv[i] = []
                for (let j = 0; j < this.numPics; j++)
                    this.mInv[i][j] = 0
            }
            for (let i = 0; i < this.numPics; i++) {
                this.mInv[i][i] = 1
            }

            for (let i = 0; i < this.numPics; i++) {
                this.basisPixels3[i] = this.blendPixelsTo3DDoubleImage(this.basisPixels, this.mInv[i]);
            }

            this.generateRandomM()

            for (let i = 0; i < this.numPics; i++) {
                this.targetPixels[i] = this.blendPixelsOfUser(this.basisPixels3, this.m[i])
                this.drawImagesInCanvas(this.targetPixels[i], i)
            }
        }

        //this.printResult()
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
            //console.log("Could not draw images into canvas.", err.message)
        }
    }

    drawUserImage(row, imgPixels) {
        // row = welche Reihe; imgPixels = wie sieht das Bild aktuell aus
        // das Bild verändert sich mit jedem Klick auf die Matrix, heißt es wird immer neu angezeigt
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
            //console.log("Could not draw user image into canvas.", err.message)
        }
    }

    calculateUserImage(wUserRow, index) {
        // berechnet das Ergebnisbild basierend auf der Matrixauswahl des Users - muss für jede Reihe einzelnd aufgerufen werden 
        let pixelsBlended = this.blendPixelsOfUser(this.basisPixels3, wUserRow)
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
        this.doGenerate = this.level.doGenerate

        //$('#js-game-timer').html("LEVEL TIMER 00:" + (this.level.time / 1000))
        if (this.levelNumber > 1)
            $('#js-game-timer').html(this.totalScore.toString().padStart(5, 0))
        $('#js-game-timer-menu').html("TIME 00:00")
        this.startTime = this.getTime()

        let currentT = 0 // updated within the progress bar
        let optimum = this.level.clickOptimum
        let clickMax = this.level.clickMaximum
        let t = this.level.time / 1000 // millisecs

        stopTimer()
        updateFuseBar(optimum, currentT, t, $('#fuse-image'), clickMax, 0) // replace progress with this
    }

    getTime() {
        // returns time
        let t = 0

        let timer = new Date()
        let h = timer.getHours()
        let m = timer.getMinutes()
        let s = timer.getSeconds()
        let ms = timer.getMilliseconds()

        let minutes = m + h * 60
        let seconds = s + minutes * 60
        let milliseconds = ms + seconds * 1000
       
        t = milliseconds
        return t
    }

    clearArrays() {
        // clear all arrays after finishing level 
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
            do this.generateRandomM()
            while (matrix_invert(this.m) == undefined)
            success = true
            this.mInv = matrix_invert(this.m)
            //console.log("Inverted Matrix:", this.mInv)
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
            // numOnes mal eine 1 in jede Zeile von m setzen
            for (let i = 0; i < this.m.length; i++) {
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
                    let same = true // identische Kombinationen/Zeilen vermeiden
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

    blendTargetAndBasisImagesPixels(pixelsIn, w) {
        // w[i] sind gewichte - nehme ich das Bild (ja oder nein?)
        // fi damit verschiebt man die Werte zum Zerolevel (-128)
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

    blendPixelsOfUser(pixelsIn, w) {
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
            /*r = (r - min) * 255 / (max - min)
            g = (g - min) * 255 / (max - min)
            b = (b - min) * 255 / (max - min)*/
            
            r = Math.min(Math.max(0, r), 255)
            g = Math.min(Math.max(0, g), 255)
            b = Math.min(Math.max(0, b), 255)

            //a = (a - min) * 255 / (max - min)
            pixels[i + 0] = Math.floor(r)
            pixels[i + 1] = Math.floor(g)
            pixels[i + 2] = Math.floor(b)
            pixels[i + 3] = 255
        }
        return pixels
    }

    blendPixelsTo3DDoubleImage(pixelsIn, w) {
        let pixels = new Array(pixelsIn[0].length)

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
            pixels[i + 0] = this.fi(r)
            pixels[i + 1] = this.fi(g)
            pixels[i + 2] = this.fi(b)
            pixels[i + 3] = this.fi(a) //volle Transparenz, a = 255
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
        // returns amount of correct user combinations 
        let correctCombinations = 0
        for (let i = 0; i < this.correctUserCombinations.length; i++) {
            if (this.correctUserCombinations[i] > 0)
                correctCombinations++
        }
        return correctCombinations
    }

    setCorrectCombination(index, value) {
        // set 1 or 0 for right / wrong combination by the user 
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
        console.log("Zusammensetzung der Basisbilder aus den Eingangsbildern (Inverse):", this.mInv)
    }

}
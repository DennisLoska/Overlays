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

    initializeUserImages() {
        // calculate all user images in the beginning with matrix filled with 0 
        let matrixValuesRow = new Array(this.numPics)
        for (let j = 0; j < this.numPics; j++) {
            matrixValuesRow[j] = 0
        }

        let currentUserImg = new Array()
        for (let row = 0; row < this.numPics; row++) {
            currentUserImg = this.calculateUserImage(matrixValuesRow, row) // returned pixel array
            this.drawUserImage(row, currentUserImg)
        }
    }

    updateOnClick(row, col) {
        // 0. Track clicks
        /* timeBar fallback
        if (this.clickCounter == 0)
            progress(this.level.time / 1000, this.level.time / 1000, $('#time-bar-wrapper'))
        */
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
        console.log("Total amount of correct combinations: " + correctCombs.toString() + " of " + this.numPics)
        if (correctCombs == this.numPics) {
            console.log("Level completed with " + this.clickCounter + " clicks!")
            this.levelScore = this.returnScore(this.clickCounter)
            console.log("Score for this level: " + this.levelScore.toString())
            this.totalScore += this.levelScore
            console.log("Score: " + this.totalScore.toString())
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
    /*
        changeClicked() {
            $('#btn-change-lvl').click(function () {
                let correctCombs = this.getAmountOfCorrectCombinations()
                if (correctCombs != this.numPics) {
                    stopTimer()
                    this.loadLevel()
                    loadGameGUI(this)
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
    */
    nextLevelClicked() {
        $('#btn-next-lvl').click(function () {
            let correctCombs = this.getAmountOfCorrectCombinations()
            if (correctCombs == this.numPics) {
                counter = 0
                this.loadLevel()
                loadGameGUI(this)
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

        this.findCombinations() // find combinations here to check colors with mInv
        console.log("Inverse Matrix: " + this.mInv)

        let images = new Images(this.mInv)
        images.numImage = this.numPics
        images.position = this.doGenerate // set position of target images (tell Images class where to draw)
        images.emptyState = this.level.emptyState

        // für die ersten 3 Level generierte Bilder nehmen, danach wieder die Images aus dem Ordner 
        if (this.doGenerate == true) {
            if (this.levelNumber < 10) {
                // generated images 
                images.generatedImages
                this.targetPixels = images.targetPixels
                this.width = images.images[0].width
                this.height = images.images[0].height
                this.calculateImages()
            } else {
                // folder images 
                images.folderImages(function (targetPixels) {
                    console.log("Image in callback:", images)
                    this.targetPixels = targetPixels
                    this.width = images.images[0].width
                    this.height = images.images[0].height
                    console.log("Targetpixels in callback:", images.targetPixels)
                    this.calculateImages()
                }.bind(this)) // Bilder aus pics Ordner
            }
        } else {
            // read basis images
            //if (this.levelNumber % 2 == 0) {
            if (this.levelNumber < 10) {
                // generated images 
                images.generatedImages
                this.basisPixels = images.targetPixels
                this.width = images.images[0].width
                this.height = images.images[0].height
                this.calculateImages()
            } else {
                // folder images 
                images.folderImages(function (basisPixels) {
                    console.log("Image in callback:", images)
                    this.basisPixels = basisPixels
                    this.width = images.images[0].width
                    this.height = images.images[0].height
                    console.log("Basispixels in callback:", images.basisPixels)
                    this.calculateImages()
                }.bind(this)) // Bilder aus pics Ordner
            }
        }
    }

    calculateImages() {
        if (this.doGenerate == true) { // generate basis from input images
            //this.findCombinations() // finde eine Konfiguration m mit Zeilensummen von mInv > 0

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
                this.mInv[i][i] = 1 //1./numOnes;
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

        this.initializeUserImages()
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

        $('#js-game-timer').html("LEVEL TIMER 00:" + (this.level.time / 1000))
        $('#js-game-timer-menu').html("TIME 00:00")
        this.startTime = this.getTime()

        /* CALCULATION FOR NEW PROGRESS BAR */
        let currentT = 0 // needs to be defined within the progress bar 
        let optimum = this.level.clickOptimum
        let t = this.level.time
        let barSize = ((2 * optimum - this.clickCounter) / optimum) * 50 + 50 * ((2 * t - currentT) / t)
        // barSize is 200 when game starts - visible progress if barSize < 100
        progress(this.level.time / 1000, this.level.time / 1000, $('#time-bar-wrapper'), this.level.clickMaximum, 0)
        updateFuseBar() // replace progress with this
    }

    getTime() {
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

    returnScore(clicks) {
        // PART 1: Clicks
        let scoreByClicks = 0
        let maximum = this.level.clickMaximum
        let optimum = this.level.clickOptimum

        if (clicks == optimum)
            scoreByClicks = 100
        else if (clicks > optimum && clicks <= maximum) {
            // zwischen click optimum und maximum: abgestuft weniger Punktzahlen
            let count = clicks - optimum // overhead; wie viele clicks über optimum
            let steps = 100.0 / (maximum - optimum) // prozentualer anteil
            // maximum - optimum = anzahl schritte die abgestuft bewertet werden
            // 100.0 / (maximum - optimum) = größe der schritte 
            scoreByClicks = 100 - (steps * count)
        } else if (clicks > maximum)
            // keine punkte wenn click maximum erreicht ist
            scoreByClicks = 0


        // PART 2: Time
        let scoreByTime = 0
        let levelTime = this.level.time // hole gesamt gegebene Zeit des Levels

        this.endTime = this.getTime()
        this.timeNeeded = this.endTime - this.startTime
        console.log("Time needed: " + this.timeNeeded + " milliseconds or " + (this.timeNeeded / 1000) + " seconds.")

        let boundaryTop = 1 / 3 * levelTime // grenze bis zu der es volle Punktzahl gibt 
        let boundaryLow = levelTime // grenze ab der es keine Punkte mehr gibt

        // unterteile punkte für zeit:
        if (this.timeNeeded <= boundaryTop) {
            //schneller als 1/3 der Zeit -> volle Punktzahl
            scoreByTime = 100
        } else if (this.timeNeeded > boundaryTop && this.timeNeeded <= boundaryLow) {
            //zwischen boundaryTop und boundaryLow der Zeit -> abgestufte Punktzahl
            let coeff = boundaryTop / this.timeNeeded
            // z.B wenn levelTime = 300000 und timeNeeded = 160000, dann: 10000 / 16000 = 0.6666 = 66.666 Punkte
            scoreByTime = 100 * coeff
        } else if (this.timeNeeded > boundaryLow) {
            //gebrauchte Zeit höher als boundaryLow -> keine Punkte
            scoreByTime = 0
        }

        let score = 0.5 * scoreByClicks + 0.5 * scoreByTime

        // PART 3: Vergabe von Sternen
        let stars = 0
        if (score >= 100 * 2 / 3) {
            stars = 3
        } else if (score < 100 * 2 / 3 && score >= 100 * 1 / 3) {
            stars = 2
        } else if (score < 100 * 1 / 3) {
            stars = 1
        } else if (score == 0) {
            stars = 0
        }
        this.stars = stars
        console.log("Sterne für dieses Level: " + stars.toString())
        //erstelle totalStars? - this.totalStars += stars 

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
            do this.generateRandomM()
            while (matrix_invert(this.m) == undefined)
            success = true
            this.mInv = matrix_invert(this.m)
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
        // fi damit verschiebt man die Werte zum Zerolevel (-128)
        console.log("blendTargetAndBasisImagesPixels()")
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
        console.log("Zusammensetzung der Basisbilder aus den Eingangsbildern (Inverse):", this.mInv)
    }

}
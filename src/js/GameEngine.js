class GameEngine {
    constructor(levelNumber) {
        this.levelNumber = levelNumber
        this.loadLevel()

        this.wUser = new Array(this.numPics, this.numPics) // matrix der userwauswahl
        //inserting dummy-values into wUser
        for (let i = 0; i < this.numPics; i++) {
            this.wUser[i] = []
            for (let j = 0; j < this.numPics; j++) {
                this.wUser[i][j] = 0
            }
        }
        this.userImagesPixels = new Array(this.numPics, this.width * this.height) // kombinierte pixel der userauswahl
        this.correctUserCombinations = new Array(this.numPics) // 1 wenn richtige kombination, 0 wenn falsch

        let targetImages = new Array(this.numPics)
        let basisImages = new Array(this.numPics)

        for (let i = 0; i < targetImages.length; i++)
            targetImages[i] = new Image()
        for (let i = 0; i < basisImages.length; i++)
            basisImages[i] = new Image()

        this.targetImages = targetImages
        this.basisImages = basisImages

        this.m = new Array(undefined, undefined)
        this.mInv = []
        this.targetPixels = new Array(undefined, undefined)
        this.basisPixels3 = new Array(undefined, undefined, undefined)

        this.maxWeight = 1 // 0.51, 0.71.. 2.01
        this.width = undefined
        this.height = undefined

        this.clickCounter = 0
        this.totalScore = 0

        this.getTargetAndBasisImages()
    }

    updateOnClick(row, col) { // row and colomn of the clicked square in index.html file
        // function should be called whenever a square is clicked by user (call in index.html onclick)

        this.clickCounter += 1;
        console.log("Amount of clicks: " + this.clickCounter.toString());

        console.log("Clicked tile is in row: " + row.toString() + " and column: " + col.toString());

        // 1. update the value in the user matrix wUser[][]
        //this.setUserMatrixValue();
        //this.wUser[row] = {} //NOT CORRECT, but solves TypeError for debugging purposes ONLY!!!
        if (this.wUser[row][col] == 1) {
            this.wUser[row][col] = 0;
        } else {
            this.wUser[row][col] = 1;
        }
        console.log("Value of wUser in row: " + row.toString() + " and column: " + col.toString() + " is: " + this.wUser[row][col].toString());
        console.log("Auswahl des Users (wUser):");
        console.log(this.wUser);

        // 2. hole die Reihenmatrix der Userauswahl für die veränderte / angeklickte Zeile
        let wUserRow = new Array(this.numPics); // bspw.: wUserRow[1, 0, 1]
        wUserRow = this.wUser[row];
        console.log("Reihenauswahl des Users (wUserRow):");
        console.log(wUserRow);

        // 3. berechne das aktuelle Zielbild, ausgehend von der Userauswahl und zeichne es
        let currentUserImg = new Array()
        currentUserImg = this.calculateUserImage(wUserRow, row); // returned pixel array
        this.drawUserImage(row, currentUserImg);
        // TODO: calculateUserImage returns an image, use this
        // returned Image is still a BufferedImage so far - change!


        // 4. check if the row is now completed; the right result in this row
        let state = this.comparePictures(row, wUserRow); // vergleiche die matrizen (user auswahl und lösungsmatrix)
        if (state == true) {
            // bei richtiger combination wird der wert auf true / 1 gesetzt
            // wenn überall true / 1 steht => level completed
            this.setCorrectCombination(row, true);
            console.log("Correct combination for row: " + row.toString());
        }

        // 5. check if all rows are finished / have the correct combinations => next level
        let correctCombs = this.getAmountOfCorrectCombinations();
        if (correctCombs == this.numPics) {
            // alle Zeilen sind richtig; Level fertig
            console.log("LEVEL COMPLETED!");
            let levelScore = this.returnScore(this.clickCounter);
            this.totalScore += levelScore;
            console.log("Score: " + this.totalScore.toString());
            // TODO: show score in GUI
            this.levelNumber += 1;
            loadSettings();
        }
    }

    drawUserImage(row, imgPixels) { // welche Reihe und wie sieht das Bild aktuell aus
        // TODO: male das vom User bisher zusammengerechnete Zielbild ins Canvas
        // dieses Bild verändert sich mit jedem Klick auf die Matrix, heißt es wird immer neu angezeigt
        let pixelsToDraw = new Uint8ClampedArray(this.width * this.height * 4)
        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                let pos = (y * this.width + x) * 4 // position in buffer based on x and y
                pixelsToDraw[pos + 0] = imgPixels[pos + 0] // R
                pixelsToDraw[pos + 1] = imgPixels[pos + 1] // G
                pixelsToDraw[pos + 2] = imgPixels[pos + 2] // B
                pixelsToDraw[pos + 3] = imgPixels[pos + 3] // A
            }
        }

        // draw user image into canvas
        let userImage = new Image()
        let canvas = document.getElementById("js-user-image-" + row.toString())
        let ctx = canvas.getContext("2d")
        canvas.width = generator.width
        canvas.height = generator.height
        userImage.onload = function() {
            ctx.drawImage(userImage, 0, 0, canvas.width, canvas.height)
        }
        let userImageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
        userImageData.data.set(pixelsToDraw)
        ctx.putImageData(userImageData, 0, 0)
    }

    loadLevel() {
        // load the settings for a specific level
        this.level = new Level(this.levelNumber)
        this.numPics = this.level.numPics
        this.numOnes = this.level.numOnes
        this.doGenerate = this.level.doGenerate()

        // load new target images 
        // calculate new basis images
        //this.resetUserMatrix()
    }

    resetUserMatrix() {
        for (let i = 0; i < this.numPics; i++) {
            this.wUser[i] = []
            for (let j = 0; j < this.numPics; j++) {
                this.wUser[i][j] = 0
            }
        }
    }

    returnScore(clicks) {
        let score = 0
        let maximum = this.level.clickMaximum
        let optimum = this.level.clickOptimum
        let fullScoreLimit = 2 * optimum;

        if (clicks == optimum || clicks <= fullScoreLimit) {
            // volle Punktzahl
            score = 100;
        } else if (clicks < maximum && clicks > fullScoreLimit) {
            // abgestuft weniger Punktzahlen
            let count = clicks - optimum;
            let schritte = (100.0 - fullScoreLimit) / maximum;
            score = 100 - (schritte * count);
        } else if (clicks > maximum) {
            // keine Punkte
            score = 0;
        }

        return score
    }

    calculateUserImage(wUserRow, index) { // TODO: not finished
        // berechnet das Ergebnisbild basierend auf der Matrixauswahl des Users 
        // muss für jede Reihe einzelnd aufgerufen werden
        let pixelsBlended = new Array()
        pixelsBlended = this.blend3DDoubleToPixels(this.basisPixels3, wUserRow) // calculates pixels for resulting image
            //let userImage = new BufferedImage(this.width, this.height, BufferedImage.TYPE_INT_ARGB)
            //userImage.setRGB(0, 0, this.width, this.height, pixelsBlended, 0, this.width)
        this.userImagesPixels[index] = pixelsBlended
            //return userImage
        return pixelsBlended
            // gibt die pixel des jeweiligen user images zurück
    }

    comparePictures(index, wUserRow) { // TODO: not finished
        // compare the combination by the user with the target image
        // compare the solution matrix m with what the user clicked wUserRow
        // int index is one specific row in the matrix
        let equals = false
        for (let i = 0; i < this.numPics; i++) {
            if (wUserRow[i] == this.m[index][i]) { // vergleiche reihe der usermatrix mit reihe der lösungsmatrix
                equals = true
            } else {
                return false
            }
        }
        return equals
    }

    getAmountOfCorrectCombinations() {
        // count how many combinations the user has right at the same time
        // if correctCombinations == numPics -> finished, switch to next level
        let correctCombinations = 0
        for (let i = 0; i < this.correctUserCombinations.length; i++) {
            if (correctUserCombinations[i] > 0)
                correctCombinations++
        }
        return correctCombinations
    }

    setCorrectCombination(index, value) {
        // set the combinations by the user (per row)
        // wenn eine Reihe die richtige Lösung ergibt, dann ist correctCombinations = 1, wenn falsch dann = 0
        if (value == true)
            this.correctUserCombinations[index] = 1
        else this.correctUserCombinations[index] = 0
    }

    getUserMatrixValue(row, col) {
        // return den value (0 oder 1) an einer bestimmten stelle in der auswahl des users
        return this.wUser[row][col]
    }

    setUserMatrixValue(row, col, value) {
        this.wUser[row][col] = value
    }

    getTargetAndBasisImages() {
        // lade die grundlegenden Bilder (aus dem pics Ordner oder mit dem generator)
        let images = new Images()
        images.numImage = this.numPics // generiere bilder mit returnGeneratedImages()

        console.log(images)

        // für die ersten 3 Level generierte Bilder nehmen, danach wieder die Images aus dem Ordner 
        if (this.doGenerate == true) {
            // generate basis from input images
            if (this.levelNumber < 3)
                this.targetImages = images.generatedImages // ImageGenerator Bilder
            else this.targetImages = images.folderImages // Bilder aus pics Ordner
            this.targetPixels = images.targetPixels
            this.width = this.targetImages[0].width
            this.height = this.targetImages[0].height
        } else {
            // read basis images
            if (this.levelNumber < 3)
                this.basisImages = images.generatedImages // ImageGenerator Bilder
            else this.basisImages = images.folderImages // Bilder aus pics Ordner

            this.width = this.basisImages[0].width
            this.height = this.basisImages[0].height
        }
        this.calculateBasisAndTargetImages()
    }

    calculateBasisAndTargetImages() {
        if (this.doGenerate == true) { // generate basis from input images
            this.findCombinations() // finde eine Konfiguration m mit Zeilensummen von mInv > 0

            let pixelsBasis = new Array(this.numPics, undefined) //int[][] pixelsBasis = new int[numPics][];
            this.basisPixels3 = new Array(this.numPics, undefined, undefined) //basisPixels3 = new double[numPics][][];
            this.basisImages = new Array(this.numPics) // Basisbilder zum Anzeigen //basisImages = new BufferedImage[numPics]; 

            for (let i = 0; i < this.numPics; i++) {
                this.basisPixels3[i] = this.blendPixelsTo3DDoubleImage(this.targetPixels, this.mInv[i])
                this.pixelsBasis[i] = this.blendPixelsToPixels(this.targetPixels, this.mInv[i])
                this.drawImagesInCanvas(this.pixelsBasis[i], i)
                // stop here - give only the pixels array into the drawImagesInCanvas() Method -> do rest

                //this.basisImages[i] = new Image() // basisImages[i] = new BufferedImage(width, height, BufferedImage.TYPE_INT_ARGB);
                //this.basisImages[i] = pixelsBasis[i]; // set RGB(A)
                //this.basisImages[i] = this.calculateSetRGB(pixelsBasis[i])
            }
        } else {
            this.mInv = new Array(this.numPics, this.numPics)
            let pixelsBasis = Array(this.numPics, this.width * this.height * 4) // TODO: * 4 ?
            for (let i = 0; i < this.numPics; i++) {
                this.mInv[i][i] = 1 //1./numOnes;
                this.basisPixels3 = new Array(this.numPics, undefined, undefined)

                this.basisImages[i] = this.calculateGetRGB(pixelsBasis[i])
                //this.basisImages[i] = pixelBasis[i] // TODO: not sure?
            }
            for (let i = 0; i < this.numPics; i++) {
                this.basisPixels3[i] = this.blendPixelsTo3DDoubleImage(pixelsBasis, this.mInv[i])
            }

            this.generateRandomM()

            this.targetPixels = new Array(this.numPics, this.width * this.height * 4) // TODO * 4?

            for (let i = 0; i < targetPixels.length; i++) {
                this.targetPixels[i] = this.blend3DDoubleToPixels(this.basisPixels3, this.m[i])
                this.drawImagesInCanvas(this.targetPixels[i], i)
                // stop here - give only the pixels array into the drawImagesInCanvas() Method -> do rest

                //this.targetImages[i] = new Image()
                //this.targetImages[i] = this.calculateSetRGB(pixelsBasis[i])
            }
        }
        this.printResult()
        //this.drawImagesInCanvas()
    }

    drawImagesInCanvas(imgData, index) { // // TODO: not finished
        // draw the calcuated basis / target images into the canvas gui
        // only have to be done once for each level
        let imagesToDraw = new Array(this.numPics)

        // which images should be drawn
        if (this.doGenerate == true) {
            imagesToDraw = this.basisImages
        } else {
            imagesToDraw = this.tragetImages
        }

        /*try {
             let targetImgData = new Array()
             for (let i = 0; i < this.numImages; i++) {
                 this.imagesToDraw[i] = new Image()
                 let j = i
                 j++
                 let canvas = document.getElementById("js-basis-image-" + j.toString())
                 let ctx = canvas.getContext("2d")
                 let img = imagesToDraw[i]
                 img.onload = function() {
                     ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
                 }
                 this.imagesToDraw[0].width = canvas.width
                 this.imagesToDraw[0].height = canvas.height
                 this.imagesToDraw[i].src = "/img/image_sets/" + this.imageNames[i + this.imageSet * 5]

                 let imgData = ctx.getImageData(0, 0, canvas.width, canvas.height)
                 targetImgData.push(imgData.data)
             }
             this.imagesToDraw = targetImgData
         } catch (err) {
             console.log("Could not load image from folder.")
             err.message = "Could not load image from folder."
         }*/
    }

    calculateSetRGB(pixels) {
        //TODO - should set the pixels of an existing image; show the image in GUI
        // this is already the drawImagesInCanvas() method for the basis / target images 

    }
    calculateGetRGB(pixels) {
        //TODO - should return rgb values of an image - generated by using a given array of pixels

        /*let imgPixels = new Uint8ClampedArray(pixels.length)
        for (let i = 0; i < imgPixels.length; i++) {
            imgPixels[i + 0] = pixels[i + 0]; //randomR; // R
            imgPixels[i + 1] = pixels[i + 1]; //randomG; // G
            imgPixels[i + 2] = pixels[i + 2]; //randomB; // B
            imgPixels[i + 3] = pixels[i + 3]; // A
        }

        let img = new Image();
        img.onload = function () {
            ctx.drawImage(img, 0, 0, img.width, img.height); // draw the image on the canvas
        }*/
    }

    findCombinations() {
        let success
        let tries = 0
        do {
            this.generateRandomM()
            success = true
            this.mInv = InverseMatrix.invert(this.m)
            console.log("Inverted Matrix:")
            console.log(this.mInv)
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

        let success;
        while (!success) {
            // numOnes mal eine 1 in jede Zeile von m setzen	
            this.m = new Array(this.numPics, this.numPics);
            //insert dummy-values into m
            for (let i = 0; i < this.numPics; i++) {
                this.m[i] = [];
                for (let j = 0; j < this.numPics; j++) {
                    this.m[i][j] = 0;
                }
            }
            for (let i = 0; i < this.numPics; i++) {
                console.log(this.numOnes);

                for (let j = 0; j < this.numOnes; j++) {
                    let index;
                    do index = Math.floor(Math.random() * this.numPics)
                    while (this.m[i][index] == 1)
                    this.m[i][index] = 1;
                }
            }
            success = true;
            for (let i = 0; i < this.numPics; i++) {
                for (let j = i + 1; j < this.numPics; j++) {
                    let same = true; // identische Kombinationen/Zeilen vermeiden
                    for (let k = 0; k < this.numPics; k++)
                        if (this.m[i][k] != this.m[j][k])
                            same = false;
                    if (same) {
                        success = false;
                        break;
                    }
                }
            }
        }
        console.log("Random Matrix:")
        console.log(this.m)
    }

    //TODO make function applyable on pixels from imagedata of Canvas-API
    blendPixelsTo3DDoubleImage(pixelsIn, w) { //pixelsIn[numPics][width*height], w[]
        //Java: private double[][] blendPixelsTo3DDoubleImage(int[][] pixelsIn, double[] w)
        console.log("PixelIn blendPixelsTo3DDoubleImage:")
        console.log(pixelsIn)

        let pixels = new Array(pixelsIn[0].length, 3) // new Uint8ClampedArray(this.width * this.height * 4) / [pixelsIn[0].length][3]

        for (let i = 0; i < pixels.length; i += 4) {

            let r = 0;
            let g = 0;
            let b = 0;
            let a = 0;

            for (let j = 0; j < pixelsIn.length; j += 4) {

                let cj = pixelsIn[j][i];
                let rj = this.f(cj + 0); // f((cj >> 16) & 255)
                let gj = this.f(cj + 1); // f((cj >>  8) & 255); 
                let bj = this.f(cj + 2); // f((cj      ) & 255);
                let aj = this.f(cj + 3); // f((cj >> 24) & 255);

                r += w[j] * rj;
                g += w[j] * gj;
                b += w[j] * bj;
                a += aj; // Transparenz wird nicht extra multipliziert 
            }

            pixels[i][0] = this.fi(r);
            pixels[i][1] = this.fi(g);
            pixels[i][2] = this.fi(b);
            // alphakanal auch speichern oder nur die RGB Werte in dem 3D Array lassen und später verwenden?
            // TODO: Pixel werden in rgb Kanäle aufgeteilt, muss hier anders berechnet werden?
        }
        return pixels
    }

    blend3DDoubleToPixels(pixelsIn, w) { // TODO: not finished
        // Ursprüngliche Parameter der Methode: (double[][][] pixelsIn, double[] w)
        //int[] pixels = new int[pixelsIn[0].length];
        let pixels = new Array(pixelsIn[0].length)

        let rMin = 0;
        let rMax = 255;
        let gMin = 0;
        let gMax = 255;
        let bMin = 0;
        let bMax = 255;

        for (let i = 0; i < pixels.length; i++) { // i+=4
            let r = 0;
            let g = 0;
            let b = 0;

            for (let j = 0; j < pixelsIn.length; j++) { // j+=4
                let rj = this.f(pixelsIn[j][i][0])
                let gj = this.f(pixelsIn[j][i][1])
                let bj = this.f(pixelsIn[j][i][2])

                r += w[j] * rj
                g += w[j] * gj
                b += w[j] * bj
            }
            r = fi(r)
            g = fi(g)
            b = fi(b)

            if (r > rMax) rMax = r
            if (r < rMin) rMin = r
            if (g > gMax) gMax = g
            if (g < gMin) gMin = g
            if (b > bMax) bMax = b
            if (b < bMin) bMin = b
        }

        let max = Math.max(rMax, Math.max(gMax, bMax))
        let min = Math.min(rMin, Math.min(gMin, bMin))

        //console.log(rMin + "," + rMax + ", " + gMin + "," + gMax + ", " + bMin + "," + bMax );

        for (let i = 0; i < pixels.length; i++) {
            let r = 0,
                g = 0,
                b = 0;

            for (let j = 0; j < pixelsIn.length; j++) {
                let rj = f(pixelsIn[j][i][0])
                let gj = f(pixelsIn[j][i][1])
                let bj = f(pixelsIn[j][i][2])

                r += w[j] * rj
                g += w[j] * gj
                b += w[j] * bj
            }
            r = fi(r)
            g = fi(g)
            b = fi(b)

            r = (r - min) * 255 / (max - min)
            g = (g - min) * 255 / (max - min)
            b = (b - min) * 255 / (max - min)

            //g = Math.min(Math.max(0, fi(g) ), 255);
            //b = Math.min(Math.max(0, fi(b) ), 255);
            //pixels[i] = 0xFF000000 | ((int)r <<16) | ((int)g << 8) | (int)b;
            pixels[i] = r
            pixels[i + 1] = g
            pixels[i + 2] = b
            pixels[i + 3] = 255 //alpha
        }

        return pixels
    }

    //TODO make function applyable on pixels from imagedata of Canvas-API
    blendPixelsToPixels(pixelsIn, w) {
        // w[i] sind gewichte - nehme ich das Bild (ja oder nein?)
        // fi damit verschiebt man die Werte zum Zerolevel (-128)
        let pixels = new Array(pixelsIn[0].length)

        for (let i = 0; i < pixels.length; i += 4) { // i+=4 WICHTIG!
            let r = 0,
                g = 0,
                b = 0;

            for (let j = 0; j < pixelsIn.length; j += 4) { // j+=4 WICHTIG!
                let cj = pixelsIn[j][i]
                let rj = this.f((cj >> 16) & 255)
                let gj = this.f((cj >> 8) & 255)
                let bj = this.f((cj) & 255)

                r += w[j] * rj
                b += w[j + 2] * bj
                g += w[j + 1] * gj
            }

            //r = (r - 128) / numOnes + 128;
            //g = (g - 128) / numOnes + 128;
            //b = (b - 128) / numOnes + 128;

            // begrenzung zwischen 0 und 255
            r = Math.min(Math.max(0, this.fi(r)), 255)
            g = Math.min(Math.max(0, this.fi(g)), 255)
            b = Math.min(Math.max(0, this.fi(b)), 255)
                //pixels[i] = 0xFF000000 | ((int)r <<16) | ((int)g << 8) | (int)b
            pixels[i] = r
            pixels[i + 1] = g
            pixels[i + 2] = b
            pixels[i + 3] = 255 //alpha
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

    printResult() {
        console.log("Lösung:")
        for (let i = 0; i < this.m.length; i++) {
            for (let j = 0; j < this.m[i].length; j++) {
                console.log("%6.2f", this.m[i][j])
            }
            console.log()
        }
        console.log("Zusammensetzung der Basisbilder aus den Eingangsbildern:")
        for (let i = 0; i < this.mInv.length; i++) {
            let sum = 0
            for (let j = 0; j < this.mInv[i].length; j++) {
                let val = this.mInv[i][j]
                console.log("%6.2f ", val)
                sum += val
            }
            console.log("  --> %6.2f\n", sum)
        }
        console.log()
    }
}
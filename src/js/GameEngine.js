class GameEngine {
    constructor(levelNumber) {
        this.levelNumber = levelNumber
        this.loadLevel()

        this.wUser = new Array(this.numPics, this.numPics) // matrix der userwauswahl 
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
        this.mInv = new Array(undefined, undefined)
        this.targetPixels = new Array(undefined, undefined)
        this.basisPixels3 = new Array(undefined, undefined, undefined)

        this.getTargetAndBasisImages()
    }

    loadLevel() {
        // load the settings for a specific level
        this.level = new Level(this.levelNumber)
        this.numPics = level.numPics
        this.numOnes = level.numOnes
        this.doGenerate = level.doGenerate()
    }

    get numPics() {
        return this.numPics
    }

    get numOnes() {
        return this.numOnes
    }

    get height() {
        return this.height
    }

    get width() {
        return this.width
    }

    set level(newLevel) {
        this.levelNumber = newLevel
    }

    get level() {
        return this.levelNumber
    }

    get doGenerate() {
        return this.doGenerate
    }

    returnScore(clicks) {
        let score = 0
        let maximum = this.level.clickMaximum()
        let optimum = this.level.clickOptimum()

        if (score == optimum)
            score = 100
        else if (score >= maximum)
            score = 0
        return score
    }

    getTargetAndBasisImages() {
        // lade die grundlegenden Bilder (aus dem pics Ordner oder mit dem generator)
        let images = new Images()
        images.numImages(numPics) // generiere bilder mit returnGeneratedImages()

        // für die ersten 3 Level generierte Bilder nehmen, danach wieder die Images aus dem Ordner 
        if (this.doGenerate == true) {
            // generate basis from input images
            if (this.levelNumber < 3)
                this.targetImages = images.generatedImages() // ImageGenerator Bilder
            else this.targetImages = images.folderImages() // Bilder aus pics Ordner

            this.targetPixels = images.generatedImages()
            this.width = this.targetImages[0].width
            this.height = this.targetImages[0].height
        } else {
            // read basis images
            if (levelNumber < 3)
                this.basisImages = images.generatedImages() // ImageGenerator Bilder
            else this.basisImages = images.folderImages() // Bilder aus pics Ordner

            this.width = this.basisImages[0].width
            this.height = this.basisImages[0].height
        }
        calculateBasisAndTargetImages()
    }

    calculateBasisAndTargetImages() {
        if (this.doGenerate == true) { // generate basis from input images
            this.findCombinations() // finde eine Konfiguration m mit Zeilensummen von mInv > 0 

            let pixelsBasis = new Array(this.numPics)
            this.basisPixels3 = new Array(this.numPics, undefined, undefined)
            this.basisImages = new Array(this.numPics) // Basisbilder zum Anzeigen

            for (let i = 0; i < this.numPics; i++) {
                this.basisPixels3[i] = this.blendPixelsTo3DDoubleImage(this.targetPixels, this.mInv[i])
                pixelsBasis[i] = this.blendPixelsToPixels(this.targetPixels, this.mInv[i])

                //basisImages[i] = new BufferedImage(width, height, BufferedImage.TYPE_INT_ARGB);
                //basisImages[i].setRGB(0, 0, width, height, pixelsBasis[i], 0, width); //Sets an array of integer pixels in the default RGB color model 
                //this.basisImages[i] = new Image()
                this.basisImages[i] = this.calculateSetRGB(pixelsBasis[i])
            }
        } else {
            this.mInv = new Array(this.numPics, this.numPics)
            let pixelsBasis = Array(this.numPics, this.width * this.height)
            for (let i = 0; i < this.numPics; i++) {
                this.mInv[i][i] = 1 //1./numOnes;
                this.basisPixels3 = new Array(this.numPics, undefined, undefined)

                //this.basisImages[i].getRGB(0, 0, width, height, pixelsBasis[i], 0, width) //returns an array of integer pixels in the default RGB color model
                this.basisImages[i] = this.calculateGetRGB(pixelsBasis[i])
            }
            for (let i = 0; i < this.numPics; i++) {
                this.basisPixels3[i] = this.blendPixelsTo3DDoubleImage(pixelsBasis, this.mInv[i])
            }

            this.generateRandomM()

            this.targetPixels = new Array(this.numPics, this.width * this.height)

            for (let i = 0; i < targetPixels.length; i++) {
                this.targetPixels[i] = this.blend3DDoubleToPixels(this.basisPixels3, this.m[i])

                //this.targetImages[i] = new BufferedImage(width, height, BufferedImage.TYPE_INT_ARGB)
                //this.targetImages[i].setRGB(0, 0, width, height, targetPixels[i], 0, width) //Sets an array of integer pixels in the default RGB color model 
                //this.targetImages[i] = new Image()
                this.targetImages[i] = this.calculateSetRGB(pixelsBasis[i])
            }
        }
        printResult()
    }

    calculateSetRGB(pixels) {
        //TODO - should set the pixels of an existing image
    }
    calculateGetRGB(pixels) {
        //TODO - should return an image - generated by using a given array of pixels
    }

    findCombinations() {
        let success
        let tries = 0
        do {
            this.generateRandomM()

            success = true
            this.mInv = InverseMatrix.invert(m)
            for (let i = 0; i < mInv.length; i++) {
                for (let j = 0; j < mInv[i].length; j++) {
                    let val = mInv[i][j]
                    if (!isFinite(val) || isNaN(val))
                        success = false // wenn Rang zu klein ist
                    else if (Math.abs(val) > maxWeight) // kein Bild stärker als mit maxContribution gewichten
                        success = false
                }
            }
        } while (!success && tries++ < 10000)

        if (!success)
            throw new Error("Impossible Settings, aborting")
    }

    generateRandomM() {
        let success
        do {
            // numOnes mal eine 1 in jede Zeile von m setzen	
            this.m = new Array(this.numPics, this.numPics)
            for (let i = 0; i < m.length; i++) {
                for (let j = 0; j < this.numOnes; j++) {
                    let index
                    do {
                        index = Math.floor(Math.random() * this.numPics) + 0
                    }
                    while (this.m[i][index] == 1)
                    this.m[i][index] = 1
                }
            }
            success = true
            for (let i = 0; i < this.numPics; i++) {
                for (let j = i + 1; j < this.numPics; j++) {
                    let same = true; // identische Kombinationen/Zeilen vermeiden
                    for (let k = 0; k < this.numPics; k++)
                        if (m[i][k] != this.m[j][k])
                            same = false
                    if (same) {
                        success = false
                        break
                    }
                }
            }
        } while (!success)
    }

    //TODO make function applyable on pixels from imagedata of Canvas-API
    blendPixelsTo3DDoubleImage(pixelsIn, w) {
        let pixels = new Array(pixelsIn[0].length, 3)

        for (let i = 0; i < pixels.length; i++) {
            let r = 0,
                g = 0,
                b = 0;

            for (let j = 0; j < pixelsIn.length; j++) {
                let cj = pixelsIn[j][i]
                let rj = f((cj >> 16) & 255)
                let gj = f((cj >> 8) & 255)
                let bj = f((cj) & 255)

                r += w[j] * rj
                g += w[j] * gj
                b += w[j] * bj
            }

            pixels[i][0] = fi(r)
            pixels[i][1] = fi(g)
            pixels[i][2] = fi(b)
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
}
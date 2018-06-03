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
        this.mInv = new Array(undefined, undefined)

        this.getTargetAndBasisImages();
    }

    loadLevel() {
        // load the settings for a specific level
        this.level = new Level(this.levelNumber);
        this.numPics = level.numPics;
        this.numOnes = level.numOnes;
        this.doGenerate = level.doGenerate();
    }

    get numPics() {
        return this.numPics
    }

    get numOnes() {
        return this.numOnes
    }

    get height() {
        return this.height;
    }

    get width() {
        return this.width;
    }

    set level(newLevel) {
        this.levelNumber = newLevel
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
                basisPixels3[i] = blendPixelsTo3DDoubleImage(this.targetPixels, this.mInv[i])
                pixelsBasis[i] = blendPixelsToPixels(this.targetPixels, this.mInv[i])

                //basisImages[i] = new BufferedImage(width, height, BufferedImage.TYPE_INT_ARGB);
                //basisImages[i].setRGB(0, 0, width, height, pixelsBasis[i], 0, width);
                basisImages[i] = new Image()
            }
        } else {
            this.mInv = new Array(this.numPics, this.numPics)
            let pixelsBasis = Array(this.numPics, this.width * this.height)
            for (let i = 0; i < this.numPics; i++) {
                this.mInv[i][i] = 1; //1./numOnes;
                this.basisPixels3 = new Array(this.numPics, undefined, undefined)
                this.basisImages[i].getRGB(0, 0, width, height, pixelsBasis[i], 0, width)
            }
            for (let i = 0; i < this.numPics; i++) {
                this.basisPixels3[i] = blendPixelsTo3DDoubleImage(pixelsBasis, this.mInv[i])
            }

            generateRandomM();

            targetPixels = new int[numPics][width * height]

            for (int i = 0; i < targetPixels.length; i++) {
                targetPixels[i] = blend3DDoubleToPixels(basisPixels3, m[i]);
                targetImages[i] = new BufferedImage(width, height, BufferedImage.TYPE_INT_ARGB)
                targetImages[i].setRGB(0, 0, width, height, targetPixels[i], 0, width)
            }
        }
        printResult();
    }


}
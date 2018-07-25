class Level {

    constructor(level) {
        this.lvl = level
        this.numPictures = undefined
        this.numOne = undefined
        this.lvlTime = undefined
        this.clickOpt = undefined
        this.clickMax = undefined
        this.generateState = undefined
        this.similarShapes = undefined
        this.amountOfLvls = 22
        this.levelSettings = new Array(this.amountOfLvls)

        for (let i = 0; i < this.amountOfLevels; i++) {
            this.levelSettings[i] = new Array()
        }
        this.setSettings()
        this.printSettings()
    }

    set level(level) {
        this.lvl = level
    }

    set numPics(numPics) {
        this.numPictures = numPics
    }

    get numPics() {
        return this.numPictures
    }

    set numOnes(num) {
        this.numOne = num
    }

    get numOnes() {
        return this.numOne
    }

    set time(time) {
        this.lvlTime = time
    }

    get time() {
        return this.lvlTime
    }

    set amountOfLevels(amount) {
        this.amountOfLvls = amount
    }

    get amountOfLevels() {
        return this.amountOfLvls
    }

    set clickMaximum(max) {
        this.clickMax = max
    }

    get clickMaximum() {
        return this.clickMax
    }

    set clickOptimum(opt) {
        this.clickOpt = opt
    }

    get clickOptimum() {
        return this.clickOpt
    }

    get doGenerate() {
        let state = this.generateState
        console.log("doGenerate: " + state)
        return state
    }

    get emptyState() {
        return this.empty
    }

    get grayState() {
        return this.grayScale
    }

    get shapesPosition(){
        return this.similarShapes
    }

    get folderImageUse() {
        return this.folderImage
    }

    calculateClicksForScore() {
        let maximum
        let optimum

        //maximum = (parseInt(Math.pow(2, this.numPictures)) - this.numOne) * this.numPictures
        optimum = this.numPictures * this.numOne
        maximum = 2 * optimum // alternativ: * this.numOne anstatt * 2

        console.log("Optimum clicks: " + optimum)
        console.log("Maximum clicks: " + maximum)

        this.clickMax = maximum
        this.clickOpt = optimum
    }

    setSettings() {
        // [numPics, numOnes, doGenerate, gray, empty, similarShapes, folderImage]
        /* numPics = anzahl bilder
           numOnes = anzahl bilder der notwendigen kombination
           doGenerate = basis / target image auswahl
           gray = generierte bilder in graustufen
           empty = ein bild soll leer sein 
           similarShapes = formen werden an ähnlichen positionen gemalt
           folderImage = benutze bild aus ordner anstatt vom generator */

        this.levelSettings[0] = [5, 2, false, false, false, false, false]
        this.levelSettings[1] = [4, 2, false, false, false, true, false]
        this.levelSettings[2] = [4, 3, false, false, false, false, false]
        this.levelSettings[3] = [5, 2, false, false, false, false, false]
        this.levelSettings[4] = [5, 3, false, false, false, false, false]

        this.levelSettings[5] = [3, 2, true, true, false, false, false] // grau
        this.levelSettings[6] = [3, 2, true, true, true, false, false] // grau und leer 
        this.levelSettings[7] = [3, 2, true, false, true, false, false] // bunt und leer
        this.levelSettings[8] = [4, 2, true, false, false, false, false] // bunt
        this.levelSettings[9] = [4, 2, true, false, true, false, false] // bunt und leer
        this.levelSettings[10] = [4, 3, false, false, false, false, false]
        this.levelSettings[11] = [4, 3, true, false, false, false, false]

        // zwischendurch auch mal realsitische Bilder, die in die jeweilige Phase reinpassen 

        this.levelSettings[12] = [3, 2, false, false, false, false, true]
        this.levelSettings[13] = [3, 2, true, false, false, false, true]
        this.levelSettings[14] = [4, 2, false, false, false, false, true]
        this.levelSettings[15] = [4, 2, false, false, false, false, true]
        this.levelSettings[16] = [4, 3, true, false, false, false, true]
        this.levelSettings[17] = [4, 3, false, false, false, false, true]
        this.levelSettings[18] = [5, 3, true, false, false, false, true]
        this.levelSettings[19] = [5, 3, false, false, false, false, true]
        this.levelSettings[20] = [5, 4, false, false, false, false, true]
        this.levelSettings[21] = [5, 4, false, false, false, false, true]

        console.log("Level:", this.lvl)
        this.numPics = this.levelSettings[this.lvl][0]
        this.numOne = this.levelSettings[this.lvl][1]
        this.generateState = this.levelSettings[this.lvl][2]

        let k = 500000 / 2 // constant k = 5s 
        let gen = 1 
        if(this.generateState == false){
            gen = 0
        }
        //this.lvlTime = k * this.numPics * (1 + gen)
        this.lvlTime = k * Math.log(this.numPics)/Math.log(2) * (1 + gen)
        console.log("level time: " + this.lvlTime)

        this.grayScale = this.levelSettings[this.lvl][3]
        this.empty = this.levelSettings[this.lvl][4]
        this.similarShapes = this.levelSettings[this.lvl][5]
        this.folderImage = this.levelSettings[this.lvl][6]

        this.calculateClicksForScore()
    }

    printSettings() {
        console.log("######################\nLevel index: " + (this.lvl) + "\nNum Pics: " + this.numPics +
            "\nNum Ones: " + this.numOne + "\nTime: " + this.lvlTime + "\nMax amount of clicks: " + this.clickMax +
            "\nTotal amount of Levels: " + this.amountOfLvls + "\n######################")
    }
}
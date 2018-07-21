class Level {

    constructor(level) {
        this.lvl = level
        this.numPictures = undefined
        this.numOne = undefined
        this.lvlTime = undefined
        this.clickOpt = undefined
        this.clickMax = undefined
        this.generateState = undefined
        this.amountOfLvls = 21
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
        // [numPics, numOnes, doGenerate, gray, empty]
        // save good seed values: 474, 193, 4, 229, 221, 324, 112, 131, 378
        this.levelSettings[0] = [3, 2, false, false, false]
        this.levelSettings[1] = [4, 2, false, false, false]
        this.levelSettings[2] = [4, 3, false, false, false]
        this.levelSettings[3] = [5, 3, false, false, false]
        this.levelSettings[4] = [5, 3, false, false, false]

        this.levelSettings[5] = [3, 2, true, false, false] // grau
        this.levelSettings[6] = [3, 2, true, false, false] // grau und leer 
        this.levelSettings[7] = [3, 2, true, false, false] // bunt und leer
        this.levelSettings[8] = [4, 2, true, false, false] // bunt
        this.levelSettings[9] = [4, 3, true, false, false] // bunt und leer
        this.levelSettings[10] = [4, 3, false, false, false]
        this.levelSettings[11] = [5, 3, true, false, false]

        // zwischendurch auch mal realsitische Bilder, die in die jeweilige Phase reinpassen 


        // GameEngine settings: if levelNumber < 10 -> generated images

        //this.levelSettings[10] = [3, 2, 30000, false, 3]
        //this.levelSettings[11] = [3, 2, 30000, true, 3]
        this.levelSettings[12] = [4, 2, false, false, false]
        this.levelSettings[13] = [4, 2, true, false, false]
        this.levelSettings[14] = [4, 2, false, false, false]
        this.levelSettings[15] = [4, 3, false, false, false]
        this.levelSettings[16] = [4, 3, true, false, false]
        this.levelSettings[17] = [5, 2, false, false, false]
        this.levelSettings[18] = [5, 2, true, false, false]
        this.levelSettings[19] = [5, 3, false, false, false]
        this.levelSettings[20] = [5, 4, false, false, false]

        console.log("Level:", this.lvl)
        this.numPics = this.levelSettings[this.lvl][0]
        this.numOne = this.levelSettings[this.lvl][1]
        this.generateState = this.levelSettings[this.lvl][2]

        let k = 5000 // constant k = 5s 
        let gen = 1 
        if(this.generateState == false){
            gen = 0
        }
        this.lvlTime = k * this.numPics * (1 + gen)

        this.grayScale = this.levelSettings[this.lvl][3]
        this.empty = this.levelSettings[this.lvl][4]

        this.calculateClicksForScore()
    }

    printSettings() {
        console.log("######################\nLevel index: " + (this.lvl) + "\nNum Pics: " + this.numPics +
            "\nNum Ones: " + this.numOne + "\nTime: " + this.lvlTime + "\nMax amount of clicks: " + this.clickMax +
            "\nTotal amount of Levels: " + this.amountOfLvls + "\n######################")
    }
}
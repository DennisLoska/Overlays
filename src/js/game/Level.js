class Level {

    constructor(level) {
        this.lvl = level
        this.numPictures = undefined
        this.numOne = undefined
        this.lvlTime = undefined
        this.clickOpt = undefined
        this.clickMax = undefined
        this.generateState = undefined
        this.imageSetNumber = undefined // photo set for background 
        this.amountOfLvls = 21
        this.levelSettings = new Array(this.amountOfLvls)

        for (let i = 0; i < this.amountOfLevels; i++) {
            this.levelSettings[i] = new Array(3)
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

    set imageSet(set) {
        this.imageSetNumber = set
    }

    get imageSet() {
        return this.imageSetNumber
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
        // [numPics, numOnes, time, doGenerate, imageSetNumber]
        this.levelSettings[0] = [3, 2, 25000, true, 0]
        this.levelSettings[1] = [3, 2, 25000, true, 0]
        this.levelSettings[2] = [3, 2, 20000, false, 0]
        this.levelSettings[3] = [3, 2, 20000, true, 1]
        this.levelSettings[4] = [4, 2, 25000, false, 1]
        this.levelSettings[5] = [4, 2, 25000, true, 1]
        this.levelSettings[6] = [4, 2, 25000, false, 2]
        this.levelSettings[7] = [4, 3, 25000, true, 2]
        this.levelSettings[8] = [4, 3, 30000, false, 2]
        this.levelSettings[9] = [4, 3, 30000, true, 3]
        this.levelSettings[10] = [5, 3, 30000, false, 3]
        this.levelSettings[11] = [5, 3, 30000, true, 3]
        this.levelSettings[12] = [5, 3, 35000, false, 4]
        this.levelSettings[13] = [5, 3, 35000, true, 4]
        this.levelSettings[14] = [5, 4, 35000, false, 4]
        this.levelSettings[15] = [5, 4, 35000, true, 5]
        this.levelSettings[16] = [5, 4, 35000, false, 5]
        this.levelSettings[17] = [5, 4, 35000, true, 5]
        this.levelSettings[18] = [5, 4, 40000, false, 6]
        this.levelSettings[19] = [5, 4, 40000, true, 6]
        this.levelSettings[20] = [5, 4, 40000, false, 6]

        console.log("Level:", this.lvl)
        this.numPics = this.levelSettings[this.lvl][0]
        this.numOne = this.levelSettings[this.lvl][1]
        this.lvlTime = this.levelSettings[this.lvl][2]
        this.generateState = this.levelSettings[this.lvl][3]
        this.imageSetNumber = this.levelSettings[this.lvl][4]

        this.calculateClicksForScore()
    }

    printSettings() {
        console.log("######################\nLevel index: " + (this.lvl) + "\nNum Pics: " + this.levelSettings[this.lvl][0] +
            "\nNum Ones: " + this.levelSettings[this.lvl][1] + "\nTime: " + this.levelSettings[this.lvl][2] + "\nMax amount of clicks: " + this.clickMax +
            "\nTotal amount of Levels: " + this.amountOfLvls + "\n######################")
    }
}
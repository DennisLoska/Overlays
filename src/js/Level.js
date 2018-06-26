class Level {

    constructor(level) {
        this.lvl = level
        this.numPictures = undefined
        this.numOne = undefined
        this.lvlTime = undefined
        this.clickOpt = undefined
        this.clickMax = undefined
        this.generateState = undefined
        this.amountOfLvls = 10
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

    calculateClicksForScore() {
        let maximum
        let optimum

        //maximum = (parseInt(Math.pow(2, this.numPictures)) - this.numOne) * this.numPictures
        optimum = this.numPictures * this.numOne
        maximum = 3 * optimum

        console.log("Optimum clicks: " + optimum)
        console.log("Maximum clicks: " + maximum)

        this.clickMax = maximum
        this.clickOpt = optimum
    }

    setSettings() {
        // LEVEL ONE
        this.levelSettings[0] = [3, 2, 40000, false]
        // LEVEL TWO
        this.levelSettings[1] = [3, 2, 40000, true]
        // LEVEL THREE
        this.levelSettings[2] = [3, 2, 35000, false]
        // LEVEL FOUR
        this.levelSettings[3] = [3, 2, 35000, true]
        // LEVEL FIVE
        this.levelSettings[4] = [4, 2, 30000, false]
        // LEVEL SIX
        this.levelSettings[5] = [4, 2, 25000, true]
        // LEVEL SEVEN
        this.levelSettings[6] = [4, 3, 25000, false]
        // LEVEL EIGHT
        this.levelSettings[7] = [5, 3, 20000, true]
        // LEVEL NINE
        this.levelSettings[8] = [5, 3, 20000, false]
        // LEVEL TEN
        this.levelSettings[9] = [5, 4, 15000, true]

        console.log("Level:", this.lvl);
        this.numPics = this.levelSettings[this.lvl][0]
        this.numOne = this.levelSettings[this.lvl][1]
        this.lvlTime = this.levelSettings[this.lvl][2]
        this.generateState = this.levelSettings[this.lvl][3]

        this.calculateClicksForScore()
    }

    printSettings() {
        console.log("######################\nLevel index: " + (this.lvl) + "\nNum Pics: " + this.levelSettings[this.lvl][0] +
            "\nNum Ones: " + this.levelSettings[this.lvl][1] + "\nTime: " + this.levelSettings[this.lvl][2] + "\nMax amount of clicks: " + this.clickMax +
            "\nTotal amount of Levels: " + this.amountOfLvls + "\n######################")
    }
}
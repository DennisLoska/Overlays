class Level {

    constructor(level) {
        this.lvl = level
        this.numPictures = undefined
        this.numOne = undefined
        this.lvlTime = undefined
        this.clickOpt = undefined
        this.clickMax = undefined
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
        return this.clickOptimum
    }

    doGenerate() {
        let state = true
        console.log("doGenerate: " + state)
        return state
    }

    calculateClicksForScore() {
        let maximum
        let optimum

        maximum = (parseInt(Math.pow(2, this.numPictures)) - this.numOne) * this.numPictures
        optimum = this.numPictures * this.numOne

        this.clickMax = maximum
        this.clickOpt = optimum
    }

    setSettings() {
        // LEVEL ONE
        this.levelSettings[0] = [3, 2, 200]
            // LEVEL TWO
        this.levelSettings[1] = [3, 2, 150]
            // LEVEL THREE
        this.levelSettings[2] = [3, 2, 120]
            // LEVEL FOUR
        this.levelSettings[3] = [3, 2, 100]
            // LEVEL FIVE
        this.levelSettings[4] = [4, 2, 100]
            // LEVEL SIX
        this.levelSettings[5] = [4, 2, 100]
            // LEVEL SEVEN
        this.levelSettings[6] = [4, 3, 100]
            // LEVEL EIGHT
        this.levelSettings[7] = [5, 3, 100]
            // LEVEL NINE
        this.levelSettings[8] = [5, 3, 100]
            // LEVEL TEN
        this.levelSettings[9] = [5, 4, 100]

        this.numPics = this.levelSettings[this.lvl][0]
        this.numOne = this.levelSettings[this.lvl][1]
        this.lvlTime = this.levelSettings[this.lvl][2]

        this.calculateClicksForScore()
    }

    printSettings() {
        console.log("######################\nLevel Index: " + this.lvl + "\nNum Pics: " + this.levelSettings[this.lvl][0] +
            "\nNum Ones: " + this.levelSettings[this.lvl][1] + "\nTime: " + this.levelSettings[this.lvl][2] +
            "\nTotal amount of Levels: " + this.amountOfLvls + "\n######################")
    }
}
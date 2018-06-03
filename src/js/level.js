class Level {

    constructor(level) {
        this.level = level
        this.numPics = undefined
        this.numOnes = undefined
        this.time = undefined
        this.clickOptimum = undefined
        this.clickMaximum = undefined
        this.amountOfLevels = 10
        this.levelSettings = new Array(this.amountOfLevels)

        for (let i = 0; i < this.amountOfLevels; i++) {
            this.levelSettings[i] = new Array(3)
        }
        this.setSettings()
        this.printSettings()
    }

    set level(level) {
        this.level = level
    }

    get numPics() {
        return this.numPics
    }

    get numOnes() {
        return this.numOnes
    }

    get time() {
        return this.time
    }

    get amountOfLevels() {
        return this.amountOfLevels
    }

    get clickMaximum() {
        return this.clickMaximum
    }

    get clickOptimum() {
        return this.clickOptimum
    }

    doGenerate() {
        return true
    }

    calculateClicksForScore() {
        let maximum
        let optimum

        maximum = (parseInt(Math.pow(2, numPics)) - numOnes) * numPics
        optimum = numPics * numOnes;

        this.clickMaximum = maximum
        this.clickOptimum = optimum
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

        this.num = this.levelSettings[this.level][0];
        this.numOnes = this.levelSettings[this.level][1];
        this.time = this.levelSettings[this.level][2];

        this.calculateClicksForScore()
    }

    printSettings() {
        console.log("######################\nLevel Index: " + this.level + "\nNum Pics: " + this.levelSettings[this.level][0] +
            "\nNum Ones: " + this.levelSettings[this.level][1] + "\nTime: " + this.levelSettings[this.level][2] +
            "\nTotal amount of Levels: " + this.amountOfLevels + "\n######################")
    }
}
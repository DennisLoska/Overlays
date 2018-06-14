class Game {
    constructor() {
        this.levelNumber = 0
        this.loadSettings()
    }

    loadSettings() {
        this.calculator = new GameEngine(this.levelNumber)
    }

    get engine() {
        return this.calculator
    }
}
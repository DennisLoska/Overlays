class Game {
    constructor() {
        this.levelNumber = 0
        this.loadSettings()
    }

    loadSettings() {
        // calculate the target / basis images to display them
        this.calculator = new GameEngine(this.levelNumber)
    }
}
class Game {
    constructor() {
        this.levelNumber = 0
        this.loadGUI()
        this.loadSettings()
    }

    loadSettings() {
        this.calculator = new GameEngine(this.levelNumber)
        clickedTile(this.calculator)
    }

    loadGUI() {
        loadGameGUI(this.calculator, this.levelNumber)
    }

    get engine() {
        return this.calculator
    }
}
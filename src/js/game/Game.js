class Game {
    constructor() {
        this.levelNumber = 0
        this.loadGUI()
        this.loadSettings()
    }

    loadSettings() {
        this.calculator = new GameEngine(this.levelNumber)
        clickedTile(this.calculator)
        //this.calculator.changeClicked()
    }

    loadGUI() {
        loadGameGUI(this.calculator)
    }

    get engine() {
        return this.calculator
    }
}
class Game {
    /*
     * Loads the main function of View.js, when the game-object is being created
     * and loads the level-settings afterwards using this.levelNumber.
     * After that this.calculator is passed to clickedTile(), which itself is a onclick
     * event-listener. 
     * 
    */
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
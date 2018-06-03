class Game {
    constructor() {
        this.levelNumber = 0;
        this.loadSettings()
    }

    loadSettings() {
        // calculate the target / basis images to display them
        this.calculator = new GameEngine(this.levelNumber)
            /*
            this.width = calculator.width;
            this.height = calculator.height;
            this.numPics = calculator.numPics;
            this.numOnes = calculator.numOnes;
            */
    }
}
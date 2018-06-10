class ImageGenerator {

    constructor() {
        this.width = 150;
        this.height = 150;

        this.rndImagePixels = new Array(this.width * this.height);

        // generate color between 1 and 255
        var randomR = Math.floor((Math.random() * 255) + 1);
        var randomG = Math.floor((Math.random() * 255) + 1);
        var randomB = Math.floor((Math.random() * 255) + 1);

        for (var i = 0; i < this.rndImagePixels.length; i += 4) {
            this.rndImagePixels[i + 0] = randomR; // R
            this.rndImagePixels[i + 1] = randomG; // G
            this.rndImagePixels[i + 2] = randomB; // B
            this.rndImagePixels[i + 3] = 255; // A
        }

    }

    set randomImagePixels(array) {
        this.rndImagePixels = array
    }

    get randomImagePixels() {
        // retrun the pixel array for a random image, use this array in Images() class
        return this.rndImagePixels;
    }

}

//left for debugging purposes
//var test = new ImageGenerator();
//console.log(test.randomImagePixels);
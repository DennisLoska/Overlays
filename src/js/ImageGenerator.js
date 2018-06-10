class ImageGenerator {

    constructor() {
        this.width = 150;
        this.height = 150;

        this.rndImagePixels = new Uint8ClampedArray(this.width * this.height * 4) //The * 4 at the end represent RGBA which we need to be compatible with canvas.

        // generate color between 1 and 255
        var randomR = Math.floor((Math.random() * 255) + 1);
        var randomG = Math.floor((Math.random() * 255) + 1);
        var randomB = Math.floor((Math.random() * 255) + 1);

        for (var y = 0; y < this.height; y++) {
            for (var x = 0; x < this.width; x++) {
                var pos = (y * this.width + x) * 4; // position in buffer based on x and y
                this.rndImagePixels[pos + 0] = randomR; // R
                this.rndImagePixels[pos + 1] = randomG; // G
                this.rndImagePixels[pos + 2] = randomB; // B
                this.rndImagePixels[pos + 3] = 255; // A
            }
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
class ImageGenerator {

    constructor() {
        this.width = 150;
        this.height = 150;

        this.randomImagePixels = new Array(this.width * this.height);

        // generate color between 1 and 255
        var randomR = Math.floor((Math.random() * 255) + 1);
        var randomG = Math.floor((Math.random() * 255) + 1);
        var randomB = Math.floor((Math.random() * 255) + 1);

        for (var i = 0; i < this.randomImagePixels.length; i+=4){
            this.randomImagePixels[i+0] = randomR; // R
            this.randomImagePixels[i+1] = randomG; // G
            this.randomImagePixels[i+2] = randomB; // B
            this.randomImagePixels[i+3] = 255; // A
         }

	}

	get randomImagePixels() {
        // retrun the pixel array for a random image, use this array in Images() class
		return this.randomImagePixels;
	}

}
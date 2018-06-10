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

    addShapes(ctx){
        // Rectangle
        ctx.fillStyle = "yellow";
        ctx.fillRect(20, 80, 100, 50);

        // Circle
        ctx.beginPath();
        ctx.arc(95, 50, 40, 0, 2 * Math.PI);
        ctx.stroke();

        // Filled triangle
        ctx.fillStyle = "blue";
        ctx.beginPath();
        ctx.moveTo(25, 25);
        ctx.lineTo(105, 25);
        ctx.lineTo(25, 105);
        ctx.fill();
        // Stroked triangle
        ctx.beginPath();
        ctx.moveTo(125, 125);
        ctx.lineTo(125, 45);
        ctx.lineTo(45, 125);
        ctx.closePath();
        ctx.stroke();

        // Font
        //ctx.font = "30px Arial";
        //ctx.fillText("Hello World", 10, 50);
    }

}

//left for debugging purposes
//var test = new ImageGenerator();
//console.log(test.randomImagePixels);
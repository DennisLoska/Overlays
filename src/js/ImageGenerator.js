class ImageGenerator {

    constructor() {
        this.width = 150;
        this.height = 150;

        this.rndImagePixels = new Uint8ClampedArray(this.width * this.height * 4) //The * 4 at the end represent RGBA which we need to be compatible with canvas.

        // generate color between 1 and 255
        var randomR = Math.floor((Math.random() * 255) + 1);
        var randomG = Math.floor((Math.random() * 255) + 1);
        var randomB = Math.floor((Math.random() * 255) + 1);

        var white = 255;

        for (var y = 0; y < this.height; y++) {
            for (var x = 0; x < this.width; x++) {
                var pos = (y * this.width + x) * 4; // position in buffer based on x and y
                this.rndImagePixels[pos + 0] = white; //randomR; // R
                this.rndImagePixels[pos + 1] = white; //randomG; // G
                this.rndImagePixels[pos + 2] = white; //randomB; // B
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
        // add random shapes in random colors to the image

        var color = this.randomColor;
        var option = Math.floor(Math.random() * 3) + 1  

        if(option == 1){
            // Rectangle
            ctx.fillStyle = color;
            ctx.fillRect(20, 80, 100, 50);
        }
        if(option == 2){
            // Circle
            ctx.fillStyle = color;
            ctx.beginPath();
            ctx.arc(75, 75, 40, 0, 2 * Math.PI);
            ctx.fill();
            ctx.closePath();
            //ctx.stroke();
        }
        if(option == 3){
            // Filled triangle
            ctx.fillStyle = color;
            ctx.beginPath();
            ctx.moveTo(125, 125);
            ctx.lineTo(125, 20);
            ctx.lineTo(20, 125);
            ctx.fill();
            ctx.closePath();
            //ctx.stroke();
        }

        // Font
        //ctx.font = "30px Arial";
        //ctx.fillText("Hello World", 10, 50);
    }

    get randomColor(){
        var c = '#'+(Math.random()*0xFFFFFF<<0).toString(16);
        return c;

        /* alternative option:
        var num = Math.floor(Math.random() * 6) + 1  
        if(num == 1){
            return "red";
        }
        if(num == 2){
            return "blue";
        }
        if(num == 3){
            return "yellow";
        }
        if(num == 4){
            return "green";
        }
        if(num == 5){
            return "orange";
        }
        if(num == 6){
            return "purple";
        }
        */
    }

}

//left for debugging purposes
//var test = new ImageGenerator();
//console.log(test.randomImagePixels);
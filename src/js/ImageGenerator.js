class ImageGenerator {

    constructor() {
        this.width = 150
        this.height = 150
            //The * 4 at the end represent RGBA which we need to be compatible with canvas.
        this.rndImagePixels = new Uint8ClampedArray(this.width * this.height * 4)

        let whiteBackground = true

            // generate color between 1 and 255
        let randomR = Math.floor((Math.random() * 255) + 1)
        let randomG = Math.floor((Math.random() * 255) + 1)
        let randomB = Math.floor((Math.random() * 255) + 1)
        let white = 255


        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                let pos = (y * this.width + x) * 4 // position in buffer based on x and y
                if(whiteBackground == true){
                    this.rndImagePixels[pos + 0] = white // R
                    this.rndImagePixels[pos + 1] = white // G
                    this.rndImagePixels[pos + 2] = white // B
                    this.rndImagePixels[pos + 3] = 255 // A
                } else{
                    this.rndImagePixels[pos + 0] = randomR; // R
                    this.rndImagePixels[pos + 1] = randomG; // G
                    this.rndImagePixels[pos + 2] = randomB; // B
                    this.rndImagePixels[pos + 3] = 255 // A 
                }
            }
        }
    }

    set randomImagePixels(array) {
        this.rndImagePixels = array
    }

    get randomImagePixels() {
        // retrun the pixel array for a random image, use this array in Images() class
        return this.rndImagePixels
    }

    addShapes(ctx) {
        // add random shapes in random colors to the image

        let color = this.randomColor
        let option = Math.floor(Math.random() * 3) + 1

        if (option == 1) {
            // Rectangle
            let xStart = this.width / 4
            let yStart = this.height / 4
            let xEnd = xStart + Math.floor(Math.random() * this.width / 2) + 1
            let yEnd = yStart + Math.floor(Math.random() * this.height / 2) + 1

            let offset = Math.floor(Math.random() * 10) + 1 // this will get a number between 1 and 10;
            offset *= Math.floor(Math.random() * 2) == 1 ? 1 : -1 // this will add minus sign in 50% of cases

            ctx.fillStyle = color
            ctx.fillRect(xStart + offset, yStart + offset, xEnd + offset, yEnd + offset)

            //let imgData = ctx.getImageData(0, 0, this.width, this.width);
            //this.rndImagePixels = imgData.data;

        }
        if (option == 2) {
            // Circle
            let offset = Math.floor(Math.random() * 20) + 1
            offset *= Math.floor(Math.random() * 2) == 1 ? 1 : -1
            let radius = Math.floor(Math.random() * 40) + 20

            ctx.fillStyle = color
            ctx.beginPath()
            ctx.arc(this.width / 2 + offset, this.height / 2 + offset, radius, 0, 2 * Math.PI)
            ctx.fill()
            ctx.closePath()

            //let imgData = ctx.getImageData(0, 0, this.width, this.width);
            //this.rndImagePixels = imgData.data;
        }
        if (option == 3) {
            // Filled triangle
            let offset = Math.floor(Math.random() * 20) + 1
            offset *= Math.floor(Math.random() * 2) == 1 ? 1 : -1

            let offset2 = Math.floor(Math.random() * 20) + 1
            offset2 *= Math.floor(Math.random() * 2) == 1 ? 1 : -1

            ctx.fillStyle = color
            ctx.beginPath()
            ctx.moveTo(110 + offset, 110 + offset2) // von 110, 110
            ctx.lineTo(110 + offset, 20 + offset) // zu 110, 20
            ctx.lineTo(20 + offset2, 110 + offset) // zu 20, 110
            ctx.fill()
            ctx.closePath()

            //let imgData = ctx.getImageData(0, 0, this.width, this.width);
            //this.rndImagePixels = imgData.data;
        }
        // Font
        //ctx.font = "30px Arial";
        //ctx.fillText("Hello World", 10, 50);

        let imgData = ctx.getImageData(0, 0, this.width, this.width);
        this.rndImagePixels = imgData.data;
    }

    get randomColor() {
        let c = '#' + (Math.random() * 0xFFFFFF << 0).toString(16)
            // no black or white:
        while (c == "#FFFFFF" || c == "#000000")
            c = '#' + (Math.random() * 0xFFFFFF << 0).toString(16)
        return c
    }
}
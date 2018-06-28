class ImageGenerator {

    constructor() {
        this.width = 150
        this.height = 150
        //The * 4 at the end represent RGBA which we need to be compatible with canvas.
        this.rndImagePixels = new Uint8ClampedArray(this.width * this.height * 4)
        this.counter = 1
        let whiteBackground = true

        // generate color between 1 and 255
        let randomR = Math.floor((Math.random() * 255) + 1)
        let randomG = Math.floor((Math.random() * 255) + 1)
        let randomB = Math.floor((Math.random() * 255) + 1)
        let white = 128

        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                let pos = (y * this.width + x) * 4 // position in buffer based on x and y
                if (whiteBackground == true) {
                    this.rndImagePixels[pos + 0] = white // R
                    this.rndImagePixels[pos + 1] = white // G
                    this.rndImagePixels[pos + 2] = white // B
                    this.rndImagePixels[pos + 3] = 255 // A
                } else {
                    this.rndImagePixels[pos + 0] = randomR // R
                    this.rndImagePixels[pos + 1] = randomG // G
                    this.rndImagePixels[pos + 2] = randomB // B
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

        let seededColor = this.seededColor

        //let option = Math.floor(Math.random() * 3) + 1
        let option = this.counter % 3+1
        if (option == 1) {
            // Rectangle
            let xStart = this.width / 4
            let yStart = this.height / 4
            let xEnd = xStart + Math.floor(Math.random() * this.width / 2) + 1
            let yEnd = yStart + Math.floor(Math.random() * this.height / 2) + 1

            let offset = Math.floor(Math.random() * 10) + 1 // this will get a number between 1 and 10;
            offset *= Math.floor(Math.random() * 2) == 1 ? 1 : -1 // this will add minus sign in 50% of cases

            ctx.fillStyle = color
            //ctx.fillRect(xStart + offset, yStart + offset, xEnd + offset, yEnd + offset)
            ctx.fillRect(20, 20, 80, 80)
        }
        if (option == 2) {
            // Circle
            let offset = Math.floor(Math.random() * 20) + 1
            offset *= Math.floor(Math.random() * 2) == 1 ? 1 : -1
            let radius = Math.floor(Math.random() * 40) + 20

            ctx.fillStyle = color
            ctx.beginPath()
            //ctx.arc(this.width / 2 + offset, this.height / 2 + offset, radius, 0, 2 * Math.PI)
            ctx.arc(this.width / 2, this.height / 2, 40, 0, 2 * Math.PI)

            ctx.fill()
            ctx.closePath()
        }
        if (option == 3) {
            // Filled triangle
            let offset = Math.floor(Math.random() * 20) + 1
            offset *= Math.floor(Math.random() * 2) == 1 ? 1 : -1

            let offset2 = Math.floor(Math.random() * 20) + 1
            offset2 *= Math.floor(Math.random() * 2) == 1 ? 1 : -1

            ctx.fillStyle = color
            ctx.beginPath()
            //ctx.moveTo(110 + offset, 110 + offset2) // von 110, 110
            //ctx.lineTo(110 + offset, 20 + offset) // zu 110, 20
            //ctx.lineTo(20 + offset2, 110 + offset) // zu 20, 110

            ctx.moveTo(110, 110) // von 110, 110
            ctx.lineTo(110, 20) // zu 110, 20
            ctx.lineTo(20, 110) // zu 20, 110

            ctx.fill()
            ctx.closePath()
        }
        this.counter++
    }

    get randomColor() {
        let c = '#' + (Math.random() * 0xFFFFFF << 0).toString(16)
        // no black or white:
        while (c == "#FFFFFF" || c == "#000000")
            c = '#' + (Math.random() * 0xFFFFFF << 0).toString(16)
        return c
    }

    get seededColor(){
        let seed = Math.floor(Math.random() * 201) // generiert random Zahl zwischen 0 und 200 
        console.log("--- SEED: " + seed + "---")

        // Random r = new Random(seed)
        let r = this.generateWithSeed(seed);
        let g = this.generateWithSeed(seed);
        let b = this.generateWithSeed(seed);

        let color = this.rgbToHex(r, g, b)
        return color
    }

    generateWithSeed(seed){
        let m_w = 123456789;
        let m_z = 987654321;
        let mask = 0xffffffff;

        // Takes any integer
        m_w = seed;
        m_z = 987654321;

        // Returns number between 0 (inclusive) and 1.0 (exclusive),
        // just like Math.random(). 
        m_z = (36969 * (m_z & 65535) + (m_z >> 16)) & mask;
        m_w = (18000 * (m_w & 65535) + (m_w >> 16)) & mask;
        let result = ((m_z << 16) + m_w) & mask;
        result /= 4294967296;
        result = result + 0.5;

        console.log("### SEED Output: " + result)
    }

    rgbToHex(r, g, b) {
        console.log("#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1));
        return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
    }
}
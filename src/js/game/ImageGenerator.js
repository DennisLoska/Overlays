class ImageGenerator {

    constructor(seed, numImgs, matrix) {
        this.width = 150
        this.height = 150
        //The * 4 at the end represent RGBA which we need to be compatible with canvas.
        this.rndImagePixels = new Uint8ClampedArray(this.width * this.height * 4)
        //this.counter = 1 //static option
        let grayBackground = true

        // generate color between 0 and 255
        let randomR = Math.floor((Math.random() * 256))
        let randomG = Math.floor((Math.random() * 256))
        let randomB = Math.floor((Math.random() * 256))
        let graylevel = 128 // gray level for background

        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                let pos = (y * this.width + x) * 4 // position in buffer based on x and y
                if (grayBackground == true) {
                    this.rndImagePixels[pos + 0] = graylevel // R
                    this.rndImagePixels[pos + 1] = graylevel // G
                    this.rndImagePixels[pos + 2] = graylevel // B
                    this.rndImagePixels[pos + 3] = 255 // A
                } else {
                    this.rndImagePixels[pos + 0] = randomR // R
                    this.rndImagePixels[pos + 1] = randomG // G
                    this.rndImagePixels[pos + 2] = randomB // B
                    this.rndImagePixels[pos + 3] = 255 // A 
                }
            }
        }

        // SEED FUNCTION:
        Math.seed = function (s) {
            var m_w = s
            var m_z = 987654321
            var mask = 0xffffffff

            m_w = 987654321 + s //added
            m_z = 123456789 - s // added

            return function () {
                m_z = (36969 * (m_z & 65535) + (m_z >> 16)) & mask
                m_w = (18000 * (m_w & 65535) + (m_w >> 16)) & mask

                var result = ((m_z << 16) + m_w) & mask
                result /= 4294967296

                return result + 0.5
            }
        }
        console.log("--- SEED: " + seed + " ---")
        this.seedFunction = Math.seed(seed) // call this function to generate nums between 0 and 1

        // store seeded colors in array
        this.seededColors = new Array(numImgs)
        // initialize - fill with dummy values / zeros
        for (let i = 0; i < this.seededColors.length; i++) {
            this.seededColors[i] = 0
        }

        // RGB values of seeded colors (hex)
        /*this.seededColorsRGB = new Array(numImgs, 3)
        for (let i = 0; i < this.seededColorsRGB.length; i++) {
            this.seededColorsRGB[i] = []
            for (let j = 0; j < 3; j++){
                this.seededColorsRGB[i][j] = j
            }
        }
        console.log(this.seededColorsRGB)*/

        // test colors (Grenzbereich, Nähe zu grau 128, Nähe zueinander)
        let tested = false;
        while(!tested){
            this.seededColors = this.randomSeed() // fill array with colors 
            tested = this.test(this.seededColors, matrix, numImgs);
            //tested = true;
        }
    }

    test(colors, matrix, numPics){
        console.log("Colors for test: " + colors); //seededColors
        console.log("Matrix for test: " + matrix); //mInv
        console.log("Matrix size: " + numPics + "x" + numPics); //mInv
        let state = true

        // declare and initialize arrays
        let seededRGB = new Array(numPics, 3) // RGB values
        let colorsMinusGray = new Array(numPics, 3) // RGB values - 128
        // fill with 0 values
        for (let i = 0; i < numPics; i++) {
            seededRGB[i] = []
            colorsMinusGray[i] = []
            for (let j = 0; j < 3; j++){
                seededRGB[i][j] = 0
                colorsMinusGray[i][j] = 0
            }
        }

        // colors[] stores hex colors – convert back to rgb and store in seededRGB[]
        for(let i = 0; i < numPics; i++){
            let r, g, b
            let c;
            let hex = colors[i]
            if(/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)){
                c= hex.substring(1).split('');
                if(c.length== 3){
                    c= [c[0], c[0], c[1], c[1], c[2], c[2]];
                }
                c= '0x'+c.join('');
                r = (c>>16)&255
                g = (c>>8)&255
                b = c&255
                seededRGB[i][0] = r
                seededRGB[i][1] = g
                seededRGB[i][2] = b
            }
        }
        //console.log(seededRGB)

        // 1. Test: Innerhalb des Grenzbereiches (- 128 * mInv + 128)
        for(let i = 0; i < numPics; i++){
            colorsMinusGray[i][0] = seededRGB[i][0] - 128; // r
            colorsMinusGray[i][1] = seededRGB[i][1] - 128; // g
            colorsMinusGray[i][2] = seededRGB[i][2] - 128; // b
        }
        console.log("COLORS - 128:")
        console.log(colorsMinusGray)
        // return false;

        // 2. Test: Distanz zu grau 128


        // 3. Test: Distanz zueinander

        return state;
    }

    set randomImagePixels(array) {
        this.rndImagePixels = array
    }

    get randomImagePixels() {
        // retrun the pixel array for a random image, use this array in Images() class
        return this.rndImagePixels
    }

    addShapes(ctx, index) {
        // add random shapes in random colors to the image
        //let color = this.randomColor
        let seededColor = this.seededColors[index] //index = welches image, von Images.js loop

        let option = Math.floor(Math.random() * 3) + 1
        //let option = this.counter % 3+1 //static option
        if (option == 1) {
            // Rectangle
            let xStart = this.width / 4
            let yStart = this.height / 4
            let xEnd = xStart + Math.floor(Math.random() * this.width / 2) + 1
            let yEnd = yStart + Math.floor(Math.random() * this.height / 2) + 1

            let offset = Math.floor(Math.random() * 10) + 1 // this will get a number between 1 and 10;
            offset *= Math.floor(Math.random() * 2) == 1 ? 1 : -1 // this will add minus sign in 50% of cases

            //ctx.fillStyle = color
            ctx.fillStyle = seededColor
            ctx.fillRect(xStart + offset, yStart + offset, xEnd + offset, yEnd + offset)
            //ctx.fillRect(20, 20, 80, 80) //static option
        }
        if (option == 2) {
            // Circle
            let offset = Math.floor(Math.random() * 20) + 1
            offset *= Math.floor(Math.random() * 2) == 1 ? 1 : -1
            let radius = Math.floor(Math.random() * 40) + 20

            //ctx.fillStyle = color
            ctx.fillStyle = seededColor
            ctx.beginPath()
            ctx.arc(this.width / 2 + offset, this.height / 2 + offset, radius, 0, 2 * Math.PI)
            //ctx.arc(this.width / 2, this.height / 2, 40, 0, 2 * Math.PI) //static option

            ctx.fill()
            ctx.closePath()
        }
        if (option == 3) {
            // Filled triangle
            let offset = Math.floor(Math.random() * 20) + 1
            offset *= Math.floor(Math.random() * 2) == 1 ? 1 : -1

            let offset2 = Math.floor(Math.random() * 20) + 1
            offset2 *= Math.floor(Math.random() * 2) == 1 ? 1 : -1

            //ctx.fillStyle = color
            ctx.fillStyle = seededColor
            ctx.beginPath()
            ctx.moveTo(110 + offset, 110 + offset2) // von 110, 110
            ctx.lineTo(110 + offset, 20 + offset) // zu 110, 20
            ctx.lineTo(20 + offset2, 110 + offset) // zu 20, 110

            //ctx.moveTo(110, 110) // von 110, 110 //static option
            //ctx.lineTo(110, 20) // zu 110, 20 //static option
            //ctx.lineTo(20, 110) // zu 20, 110 //static option

            ctx.fill()
            ctx.closePath()
        }
        //this.counter++ //static option
    }

    get randomColor() {
        let c = '#' + (Math.random() * 0xFFFFFF << 0).toString(16)
        // no black or white:
        while (c == "#FFFFFF" || c == "#000000")
            c = '#' + (Math.random() * 0xFFFFFF << 0).toString(16)
        return c
    }

    randomSeed() {
        // fill with random rgb
        for (let i = 0; i < this.seededColors.length; i++) {
            // this.seedFunction() defined in constructor 
            let r = this.seedFunction()
            let g = this.seedFunction()
            let b = this.seedFunction()

            r = Math.floor(r * 255)
            g = Math.floor(g * 255)
            b = Math.floor(b * 255)

            let color = this.rgbToHex(r, g, b) // hex color

            this.seededColors[i] = color
            console.log("seededColors[" + i + "] = " + color + ", rgb(" + r + ", " + g + ", " + b + ")")
        }
        return this.seededColors
    }

    rgbToHex(r, g, b) {
        // turns rgb into hex string 
        return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)
    }
}
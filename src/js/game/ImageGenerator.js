class ImageGenerator {

    constructor(seed, numImgs, matrix, gray) {
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

        //this.seededColors = this.randomSeed() // fill array with colors 

        // test colors (Grenzbereich 0 bis 255, Nähe zu grau 128, Nähe zueinander)
        let tested = false;
        console.log("--- START TEST ---");
        while(!tested){
            this.seededColors = this.randomSeed() // fill array with colors 
            tested = this.test(this.seededColors, matrix, numImgs);
        }
        console.log("--- TEST SUCCESSFULLY COMPLETED ---");



        this.colorsForImages = new Array(numImgs)
        // initialize - fill with dummy values / zeros
        for (let i = 0; i < this.colorsForImages.length; i++) {
            this.colorsForImages[i] = 0
        }
        this.colorsForImages = this.getTestedColors(numImgs, gray)
    }

    test(colors, matrix, numPics){
        //console.log("Colors for test: " + colors); //seededColors
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


        /* 1. TEST: Innerhalb des Grenzbereiches 0-255 nach Überlagerung (- 128 * mInv + 128) */
        for(let i = 0; i < numPics; i++){
            colorsMinusGray[i][0] = seededRGB[i][0] - 128; // r
            colorsMinusGray[i][1] = seededRGB[i][1] - 128; // g
            colorsMinusGray[i][2] = seededRGB[i][2] - 128; // b
        }
        //console.log("colors - 128:")
        //console.log(colorsMinusGray)

        /*let mixedColors = new Array(numPics, numPics) // colors - 128 * mInv
        // initialize - fill with dummy values / zeros
        for (let i = 0; i < mixedColors.length; i++) {
            mixedColors[i] = []
            for (let j = 0; j < 3; j++) {
                mixedColors[i][j] = 0
            }
        }*/
        let mixedColors = new Array(numPics, 3) // matrix der userwauswahl
        //inserting dummy-values into wUser - zeros
        for (let i = 0; i < numPics; i++) {
            mixedColors[i] = []
            for (let j = 0; j < 3; j++)
                mixedColors[i][j] = 0
        }

        /*
        let mixedColors = new Array(numPics)
        for (let i = 0; i < mixedColors.length; i++) {
            mixedColors[i] = 0
        }*/

        // multiply with inverse matrix[][]
        for(let row = 0; row < numPics; row++){
            for(let col = 0; col < numPics; col++){
                //colorsMinusGray[numPics][rgb]
                //mixedColors[numPics][rgb]
                //mixedColors[i] += Math.floor(colorsMinusGray[i][j] * matrix[i][j])
                for(let rgb = 0; rgb < 3; rgb++){
                    mixedColors[row][rgb] += Math.floor(colorsMinusGray[row][rgb] * matrix[row][col])
                }
            }
        }
        //console.log("(colors - 128) * mInv")
        //console.log(mixedColors)

        // + 128 and check if between 0 and 255
        for(let i = 0; i < numPics; i++){
            for(let rgb = 0; rgb < 3; rgb++){
                mixedColors[i][rgb] += 128
                if(mixedColors[i][rgb] < 0 && mixedColors[i][rgb] > 255){
                    console.log("### TEST 1 ERROR: Color is not inside 0-255 zone.");
                    return false;
                }  
            }
        }
        //console.log("(colors - 128) * mInv + 128:")
        //console.log(mixedColors)


        /* 2. TEST: Distanz zu grau 128 */
        let distanceMin = 20000 // minimum square distance to 128
        for (let i = 0; i < colors.length; i++) {
            let differenceR = 128 - seededRGB[i][0] // 128 - r
            let differenceG = 128 - seededRGB[i][1] // 128 - g
            let differenceB = 128 - seededRGB[i][2] // 128 - b
            let distance = Math.pow(differenceR, 2) + Math.pow(differenceG, 2) + Math.pow(differenceB, 2)

            if(distance < distanceMin){
                console.log("### TEST 2 ERROR: Color too close to 128")
                return false;
            }
        }

        
        /* 3. TEST: Distanz der Farben zueinander */
        let distanceToEachOther = 28000 // minimum square distance to each color
        for (let i = 0; i < colors.length; i++) {
            for (let j = 0; j < colors.length; j++) {
                if(i != j){
                    let differenceR = seededRGB[j][0] - seededRGB[i][0] // r1 - r2
                    let differenceG = seededRGB[j][1] - seededRGB[i][1] // g1 - g2
                    let differenceB = seededRGB[j][2] - seededRGB[i][2] // b1 - b2

                    let totalSquareDistance = Math.pow(differenceR, 2) + Math.pow(differenceG, 2) + Math.pow(differenceB, 2)
                    
                    if(totalSquareDistance < distanceToEachOther){
                        console.log("### TEST 3 ERROR: Color too close to another color.")
                        return false;
                    }
                }
            }
        }
        return state;
    }

    set randomImagePixels(array) {
        this.rndImagePixels = array
    }

    get randomImagePixels() {
        // retrun the pixel array for a random image, use this array in Images() class
        return this.rndImagePixels
    }

    addShapes(ctx, index, empty) {
        // empty = boolean if one picture should be empty

        // add random shapes in random colors to the image
        //let color = this.randomColor

        //let seededColor = this.seededColors[index] //index = welches image, von Images.js loop
        // OLD SEEDED COLOR CALCULATION

        let seededColor = this.colorsForImages[index]
        //console.log("### let seededColor = " + seededColor)

        if(!empty){ 
        // if empty - don't draw anything

        let option = Math.floor(Math.random() * 3) + 1
        //let option = this.counter % 3+1 //static option
        if (option == 1) {
            // Rectangle
            console.log("Rectangle")
            /*
            let xStart = Math.floor(Math.random() * this.width*3 / 4) + this.width / 4
            let yStart = Math.floor(Math.random() * this.height*3 / 4) + this.height / 4
            let xEnd = xStart + Math.floor(Math.random() * this.width - xStart) + 20 // min width: 20
            let yEnd = yStart + Math.floor(Math.random() * this.height - yStart) + 20

            let offset = Math.floor(Math.random() * 10) + 1 // this will get a number between 1 and 10;
            offset *= Math.floor(Math.random() * 2) == 1 ? 1 : -1 // this will add minus sign in 50% of cases

            let offset2 = Math.floor(Math.random() * 10) + 1 // this will get a number between 1 and 10;
            offset2 *= Math.floor(Math.random() * 2) == 1 ? 1 : -1 // this will add minus sign in 50% of cases

            // two offsets so that the shapes do not look too similar 

            //ctx.fillStyle = color
            ctx.fillStyle = seededColor
            ctx.fillRect(xStart, yStart, xEnd, yEnd)
            //ctx.fillRect(20, 20, 80, 80) //static option
            */


            let xStart = this.width / 4
            let yStart = this.height / 4

            //let xPos = Math.floor(Math.random() * this.width / 2) + 1
            //let yPos = Math.floor(Math.random() * this.height / 2) + 1

            let xEnd = xStart + Math.floor(Math.random() * this.width / 2) + 1
            let yEnd = yStart + Math.floor(Math.random() * this.height / 2) + 1
 
            let offset = Math.floor(Math.random() * 10) + 1 // this will get a number between 1 and 10;
            offset *= Math.floor(Math.random() * 2) == 1 ? 1 : -1 // this will add minus sign in 50% of cases
 
            //ctx.fillStyle = color
            ctx.fillStyle = seededColor
            ctx.fillRect(xStart + offset, yStart + offset, xEnd + offset, yEnd + offset)
            //ctx.fillRect(xPos + offset, yPos + offset, xEnd + offset, yEnd + offset)
        }
        if (option == 2) {
            // Circle
            console.log("Circle")
            let offset = Math.floor(Math.random() * 20) + 1
            offset *= Math.floor(Math.random() * 2) == 1 ? 1 : -1 // add minus sign in 50% of cases
            let radius = Math.floor(Math.random() * this.width / 3) + 20 // width/3 > radius > 20 (min radius size)

            let xPos = 0
            let yPos = 0

            while(xPos < this.width/4 || xPos > this.width*3/4){
                xPos = Math.floor(Math.random() * this.width)
            }
            while(yPos < this.height/4 || yPos > this.height*3/4){
                yPos = Math.floor(Math.random() * this.height)
            }

            //ctx.fillStyle = color
            ctx.fillStyle = seededColor
            ctx.beginPath()
            //ctx.arc(this.width / 2 + offset, this.height / 2 + offset, radius, 0, 2 * Math.PI)
            ctx.arc(xPos, yPos, radius, 0, 2 * Math.PI)
            //ctx.arc(this.width / 2, this.height / 2, 40, 0, 2 * Math.PI) //static option

            ctx.fill()
            ctx.closePath()
        }
        if (option == 3) {
            // Filled triangle
            console.log("Triangle")
            let offset = Math.floor(Math.random() * 20) + 1
            offset *= Math.floor(Math.random() * 2) == 1 ? 1 : -1

            let offset2 = Math.floor(Math.random() * 20) + 1
            offset2 *= Math.floor(Math.random() * 2) == 1 ? 1 : -1

            let offset3 = Math.floor(Math.random() * 20) + 1
            offset3 *= Math.floor(Math.random() * 2) == 1 ? 1 : -1

            let offset4 = Math.floor(Math.random() * 20) + 1
            offset4 *= Math.floor(Math.random() * 2) == 1 ? 1 : -1

            // random position to start
            //let xPos = Math.floor(Math.random() * this.width*3/4) + this.width/4
            //let yPos = Math.floor(Math.random() * this.height*3/4) + this.height/4

            let xPos = 0
            let yPos = 0

            while(xPos < this.width/4 || xPos > this.width*3/4){
                xPos = Math.floor(Math.random() * this.width)
            }
            while(yPos < this.height/4 || yPos > this.height*3/4){
                yPos = Math.floor(Math.random() * this.height)
            }

            //ctx.fillStyle = color
            ctx.fillStyle = seededColor
            ctx.beginPath()
            ctx.moveTo(110 + offset, 110 + offset2) // von 110, 110
            ctx.lineTo(110 + offset, 20 + offset) // zu 110, 20
            ctx.lineTo(20 + offset2, 110 + offset) // zu 20, 110

            /*ctx.moveTo(xPos, yPos) // von 110, 110
            ctx.lineTo(xPos + offset, yPos) // zu 110, 20
            ctx.lineTo(xPos, yPos + offset2) // zu 20, 110*/

            /*console.log("moveTo: (" + xPos + ", " + yPos + ")")
            console.log("lineTo: (" + xPos + offset + ", " + yPos + offset2 + ")")
            console.log("lineTo: (" + xPos + offset3 + ", " + yPos + offset4 + ")")*/

            /*ctx.moveTo(110, 110) // von 110, 110 //static option
            ctx.lineTo(110, 20) // zu 110, 20 //static option
            ctx.lineTo(20, 110) // zu 20, 110 //static option*/

            ctx.fill()
            ctx.closePath()
        }

        } // close of if(!empty)

        //this.counter++ //static option
    }

    get randomColor() {
        let c = '#' + (Math.random() * 0xFFFFFF << 0).toString(16)
        // no black or white:
        while (c == "#FFFFFF" || c == "#000000")
            c = '#' + (Math.random() * 0xFFFFFF << 0).toString(16)
        return c
    }

    getTestedColors(amountOfPictures, grayscale){
        // amount of pictures = amount of colors needed
        // grayscale = all black and white images

        let setOfColors = new Array(amountOfPictures) // array of colors

        if(amountOfPictures == 3){
             // getestete 3er Kombinationen der Farben, numPics = 3
            setOfColors = [
                    ["#4a00e9", "#de1a06", "#2bf488"],
                    ["#1ae1f8", "#94fd01", "#881bf9"],
                    ["#36fdf5", "#24cb0b", "#fa05c3"],
                    ["#89300a", "#4ed908", "#b10bbf"],
                    ["#0fdded", "#5633f5", "#8efa2d"],
                    ["#0e00ec", "#d4db30", "#156c13"],
                    ["#d809e9", "#e4d910", "#10aace"],
                    ["#753afc", "#03d3a1", "#872c08"],
                    ["#af33f5", "#e7ea5c", "#33c7f4"],
                    ["#fba8e8", "#18bdda", "#6a05dc"],
                    ["#fde947", "#f00916", "#1b2dc9"],
                    ["#04f8c8", "#160ae2", "#c01112"],
                    ["#0d05a3", "#c818dd", "#f1f516"],
                    ["#23bbeb", "#1b02f6", "#f0a219"],
                    ["#fb4bd3", "#fac80a", "#0bc6e2"],
                    ["#08dc4c", "#6f0816", "#aa15f0"],
                    ["#fa1119", "#fbe33d", "#350209"],
                    ["#fb04ef", "#cafac4", "#d96d07"],
                    ["#f232f9", "#3805c8", "#1df4ae"],
                    ["#5ff4f3", "#29d70e", "#8b06cb"],
                    ["#ce005d", "#050c6a", "#f8da62"],
                    ["#1689e3", "#e5ec8d", "#fd69fb"],
                    //["", "", ""],
            ]
        } else if(amountOfPictures == 4){
            // getestete 4er Kombinationen der Farben, numPics = 4
            setOfColors = [
                    ["#062dd1", "#16f1d6", "#e706a7", "#d6f18b"],
                    ["#1fa6f4", "#004861", "#14f326", "#f1cfb9"],
                    ["#6c1317", "#e7df60", "#06cedc", "#08d830"],
                    ["#04a41c", "#2031ee", "#0cfdbe", "#f4c32c"],
                    ["#46c905", "#eb6206", "#131599", "#f727c9"],
                    ["#2ae8d5", "#e9840f", "#1638c3", "#cf5bfb"],
                    ["#1917a9", "#be2229", "#37c30f", "#3fede4"],
                    ["#1f0156", "#ef7903", "#08dfde", "#f848d4"],
                    ["#f93247", "#1a73ea", "#f3ef7d", "#19f41b"],
                    ["#4206ed", "#81013c", "#fdcfb2", "#21f286"],
                    ["#d970fc", "#f71208", "#260a48", "#03e2c3"],
                    ["#17d5f2", "#97fb25", "#131fd1", "#d32feb"],
                    ["#1d0c9c", "#f208ba", "#c0fc68", "#2ef2fd"],
                    ["#14ab1c", "#b62519", "#84f3e9", "#fa73f0"],
                    ["#1f0156", "#ef7903", "#08dfde", "#f848d4"],
                    ["#14f700", "#d81c3c", "#59e1e3", "#fdbe5e"],
                    //["", "", "", ""],
            ]
        } else if(amountOfPictures == 5){
                // getestete 5er Kombinationen der Farben, numPics = 5
            setOfColors = [
                    ["#e7dad8", "#672811", "#2fb5f7", "#f416d6", "#faec1d"],
                    ["#fba3c6", "#5a16fe", "#5fe2fb", "#e3d409", "#c71341"],
                    ["#150aa6", "#02c7d8", "#de2bcb", "#e3e3f7", "#f15028"],
                    ["#3df913", "#ecf86f", "#70e7f5", "#4f0812", "#2413cd"],
                    ["#1f4ded", "#d7780d", "#f8d1ea", "#ed13b9", "#53f3e8"],
                    ["#c72ada", "#14adec", "#d8ef6c", "#0fe838", "#ce041a"],
                    //["", "", "", "", ""],
            ]
        }
    
        let index = Math.floor((Math.random() * setOfColors.length)) // zufälliges set 
        this.colorsForImages = setOfColors[index]
        
        if(grayscale == true){
            for(let i = 0; i < amountOfPictures; i++){
                // generate random gray values
                let v = (Math.random()*(256)|0).toString(16);//bitwise OR. Gives value in the range 0-255 which is then converted to base 16 (hex).
                let color = "#" + v + v + v;
                this.colorsForImages[i] = color.toString()
            }


            /*
            // test min distance to 128 
            let tested = false
            let distanceMin = 30000 // minimum square distance to 128
            let imagesWithCorrectDistance = 0
            
            while(!tested){
                for(let i = 0; i < amountOfPictures; i++){
                    // generate random gray values
                    let v = (Math.random()*(256)|0).toString(16);//bitwise OR. Gives value in the range 0-255 which is then converted to base 16 (hex).
                    let color = "#" + v + v + v;
                    this.colorsForImages[i] = color.toString()
                }

                let rgbColors = this.hexToRGB(this.colorsForImages, amountOfPictures)
                console.log(rgbColors)

                for (let i = 0; i < amountOfPictures; i++) {
                    let differenceR = 128 - rgbColors[i][0] // 128 - r
                    let differenceG = 128 - rgbColors[i][1] // 128 - g
                    let differenceB = 128 - rgbColors[i][2] // 128 - b
                    let distance = Math.pow(differenceR, 2) + Math.pow(differenceG, 2) + Math.pow(differenceB, 2)
    
                    if(distance < distanceMin){
                        tested = false
                        console.log("Gray too close to 128.")
                    } else{
                        imagesWithCorrectDistance += 1
                        if(imagesWithCorrectDistance == amountOfPictures){
                            return this.colorsForImages 
                        }
                    }
                }
            }*/
        } 

        console.log("Colors: " + this.colorsForImages)

        return this.colorsForImages
    }


    hexToRGB(colors, numPics){
        // declare and initialize arrays
        let seededRGB = new Array(numPics, 3) // RGB values
        // fill with 0 values
        for (let i = 0; i < numPics; i++) {
            seededRGB[i] = []
            for (let j = 0; j < 3; j++){
                    seededRGB[i][j] = 0
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
        return seededRGB
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
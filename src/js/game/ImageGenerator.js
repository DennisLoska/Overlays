class ImageGenerator {

    constructor(numImgs, gray) {
        this.width = 150
        this.height = 150
        //The * 4 at the end represent RGBA which we need to be compatible with canvas.
        this.rndImagePixels = new Uint8ClampedArray(this.width * this.height * 4)
        let grayBackground = true

        // generate color between 0 and 255
        let randomR = Math.floor((Math.random() * 256))
        let randomG = Math.floor((Math.random() * 256))
        let randomB = Math.floor((Math.random() * 256))
        let graylevel = 128 // gray level for background

        // fill background
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

        this.colorsForImages = new Array(numImgs)
        // initialize - fill with dummy values / zeros
        for (let i = 0; i < this.colorsForImages.length; i++) {
            this.colorsForImages[i] = 0
        }
        this.colorsForImages = this.getTestedColors(numImgs, gray)
    }

    set randomImagePixels(array) {
        this.rndImagePixels = array
    }

    get randomImagePixels() {
        // retrun the pixel array for a random image, use this array in Images() class
        return this.rndImagePixels
    }

    addShapes(ctx, index, empty, similar) {
        // add random shapes in random colors to the image
        // empty = boolean if one picture should be empty
        // similar = boolean if shapes should be in similar positions
        let color = this.colorsForImages[index]

        if(!empty){ 
        // if empty - don't draw anything

        let option = Math.floor(Math.random() * 3) + 1
        //let option = this.counter % 3+1 //static option
        if (option == 1) {
            // Rectangle
            if(similar){
                // leicht versetzte Startpositionen 
                let xStart = this.width / 4 + Math.floor(Math.random() * 10)
                let yStart = this.height / 4 + Math.floor(Math.random() * 10)

                // leicht versetzte Endpositionen 
                let xEnd = xStart + this.width / 4 + Math.floor(Math.random() * 10)
                let yEnd = yStart + this.height / 4 + Math.floor(Math.random() * 10)
    
                ctx.fillStyle = color
                ctx.fillRect(xStart, yStart, xEnd, yEnd)
            } else{
                let xStart = this.width / 4
                let yStart = this.height / 4

                let xEnd = xStart + Math.floor(Math.random() * this.width / 2) + 1
                let yEnd = yStart + Math.floor(Math.random() * this.height / 2) + 1

                // add random offset to all positions 
                let offsets = new Array(4)
                for(let i = 0; i < offsets.length; i++){
                    let offset = Math.floor(Math.random() * 21) // this will get a number between 0 and 20;
                    offset *= Math.floor(Math.random() * 2) == 1 ? 1 : -1 // this will add minus sign in 50% of cases
                    offsets[i] = offset
                }
 
                ctx.fillStyle = color
                ctx.fillRect(xStart + offsets[0], yStart + offsets[1], xEnd + offsets[2], yEnd + offsets[3])
            }
        }
        if (option == 2) {
            // Circle
            if(similar){
                // add offset to positions 
                let offset = Math.floor(Math.random() * 10) + 1
                let radius = this.width / 4 
                
                ctx.fillStyle = color
                ctx.beginPath()
                ctx.arc(this.width / 2 + offset, this.height / 2 + offset, radius + offset, 0, 2 * Math.PI)
                ctx.fill()
                ctx.closePath()
            } else{
                let radius = Math.floor(Math.random() * this.width / 3) + 20 // width/3 > radius > 20 (min radius size)
                let xPos = 0
                let yPos = 0
    
                // get x and y positions between 1/4 and 3/4 of width and height
                while(xPos < this.width/4 || xPos > this.width*3/4){
                    xPos = Math.floor(Math.random() * this.width)
                }
                while(yPos < this.height/4 || yPos > this.height*3/4){
                    yPos = Math.floor(Math.random() * this.height)
                }
    
                ctx.fillStyle = color
                ctx.beginPath()
                ctx.arc(xPos, yPos, radius, 0, 2 * Math.PI)
                ctx.fill()
                ctx.closePath()
            }
        }
        if (option == 3) {
            // Triangle
            if(similar){
                // add offset to static positions
                let offset = Math.floor(Math.random() * 20) + 1
                let offset2 = Math.floor(Math.random() * 20) + 1
    
                ctx.fillStyle = color
                ctx.beginPath()
                ctx.moveTo(110 + offset, 110 + offset2) // von 110, 110
                ctx.lineTo(110 + offset, 20 + offset) // zu 110, 20
                ctx.lineTo(20 + offset2, 110 + offset) // zu 20, 110
                ctx.fill()
                ctx.closePath()
            } else{
                let offset = Math.floor(Math.random() * this.width/4) + 50
                offset *= Math.floor(Math.random() * 2) == 1 ? 1 : -1
                let offset2 = Math.floor(Math.random() * this.width/4) + 10
                offset2 *= Math.floor(Math.random() * 2) == 1 ? 1 : -1
    
                // random position to start
                let xPos = 0
                let yPos = 0
                // get x and y positions between 1/3 and 2/3 of width and height
                while(xPos < this.width/3 || xPos > this.width*2/3){
                    xPos = Math.floor(Math.random() * this.width)
                }
                while(yPos < this.height/3 || yPos > this.height*2/3){
                    yPos = Math.floor(Math.random() * this.height)
                }

                ctx.fillStyle = color
                ctx.beginPath()
                ctx.moveTo(xPos, yPos)
                ctx.lineTo(xPos + offset2, yPos + offset)
                ctx.lineTo(yPos + offset, xPos)
                ctx.fill()
                ctx.closePath()      
            }
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
        // amount of pictures = amount of colors needed (size of array)
        // grayscale = all black and white images

        let setOfColors = new Array(amountOfPictures) // array of colors

        if(amountOfPictures == 3){
             // getestete 3er Kombinationen der Farben, numPics = 3
            if(grayscale == true){
                setOfColors = [
                    ["#d8d8d8", "#e8e8e8", "#484848"],
                    ["#e4e4e4", "#2c2c2c", "#3f3f3f"],
                    ["#191919", "#ababab", "#3f3f3f"],
                    ["#dfdfdf", "#565656", "#393939"],
                    ["#515151", "#bcbcbc", "#f0f0f0"],
                ]
            } else {
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
                    ["#04b5b5", "#de1860", "#28f90e"],
                    ["#2ef396", "#e718d4", "#1c48fe"],
                    ["#f5780e", "#0d62d2", "#06fe0f"],
                    ["#8ade15", "#d631f8", "#106ed6"],
                    ["#e7e183", "#ea27e4", "#59e90e"],
                ]
            }
        } else if(amountOfPictures == 4){
            // getestete 4er Kombinationen der Farben, numPics = 4
            if(grayscale == true){
                setOfColors = [
                    ["#292929", "#606060", "#656565", "#a6a6a6"],
                    ["#d4d4d4", "#232323", "#5f5f5f", "#555555"],
                    ["#ddd", "#474747", "#5e5e5e", "#676767"],
                ]
            } else {
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
                    ["#c8ef1c", "#d80c06", "#01d342", "#dca0e9"],
                    ["#201461", "#b0ee24", "#02fcab", "#db40ec"],
                    ["#f4e91d", "#e402d1", "#085bd1", "#0d7122"],
                    ["#fb1a79", "#0109c4", "#1bee41", "#cee1c5"],
                    ["#1163da", "#e06b05", "#26ec63", "#ef02ca"],
                    ["#0b1e4b", "#bced14", "#43face", "#ce01b0"],
                    ["#67fdf5", "#21d81a", "#fc51d5", "#0600e6"],
                    ["#c90e09", "#d222fe", "#24d5d3", "#1c22cc"],
                    ["#302015", "#35d4e7", "#3af633", "#e70144"],
                    ["#2a9bf7", "#12df48", "#c9e1dc", "#adc303"],
                    ["#0c05b1", "#f91067", "#14d2f6", "#f0b63c"],
                    ["#370ff6", "#36e701", "#07212a", "#f82ca9"],
                    ["#580930", "#f2f82e", "#ebf7d8", "#f12dd0"],
                    ["#e428be", "#fea136", "#182bc6", "#fbefd8"],
                    ["#2a2532", "#05ecbd", "#e1251a", "#d723e0"],
                ]
            }
        } else if(amountOfPictures == 5){
            // getestete 5er Kombinationen der Farben, numPics = 5
            if(grayscale == true){
                setOfColors = [
                    ["#111111", "#a2a2a2", "#e8e8e8", "#949494", "#3c3c3c"],
                    ["#d9d9d9", "#dbdbdb", "#f2f2f2", "#2c2c2c", "#616161"],
                    ["#b4b4b4", "#2c2c2c", "#c6c6c6", "#9e9e9e", "#424242"],
                ]
            } else{
                setOfColors = [
                    ["#e7dad8", "#672811", "#2fb5f7", "#f416d6", "#faec1d"],
                    ["#fba3c6", "#5a16fe", "#5fe2fb", "#e3d409", "#c71341"],
                    ["#150aa6", "#02c7d8", "#de2bcb", "#e3e3f7", "#f15028"],
                    ["#3df913", "#ecf86f", "#70e7f5", "#4f0812", "#2413cd"],
                    ["#1f4ded", "#d7780d", "#f8d1ea", "#ed13b9", "#53f3e8"],
                    ["#c72ada", "#14adec", "#d8ef6c", "#0fe838", "#ce041a"],
                    ["#172702", "#f49ad0", "#19fcfc", "#f4c816", "#2f09f7"],
                    ["#c661fd", "#e38707", "#1a51f4", "#02f7d8", "#fdf7be"],
                    ["#b60028", "#22f497", "#0126de", "#dfafe6", "#d0c818"],
                    ["#f1030b", "#de27c0", "#fdf59a", "#5ff10c", "#29c4fa"],
                    ["#d3e6e1", "#1526ab", "#e24f21", "#19f0de", "#14fd37"],
                    ["#fba3c6", "#5a16fe", "#5fe2fb", "#e3d409", "#c71341"],
                    ["#1dd9cc", "#d4800c", "#18f420", "#f924fc", "#d4edac"],
                    ["#c72ada", "#14adec", "#d8ef6c", "#0fe838", "#ce041a"],
                    ["#4d0011", "#0bdf42", "#e125e2", "#e2bd2b", "#3b3af8"],
                    ["#ee0881", "#f5a4cd", "#45eef1", "#54d70d", "#3e0349"],
                    ["#ec6508", "#0447fb", "#d369f4", "#366000", "#97fd2f"],
                    ["#132d54", "#f408f2", "#d1fb5e", "#2dd0f0", "#3927f7"],
                    ["#0f0cd8", "#f4b5dd", "#0af7f9", "#ed4040", "#32ed52"],
                    ["#2c5112", "#c513d5", "#e80c0b", "#cdfb99", "#2cb7eb"],
                    ["#35f5d1", "#4311c5", "#fe14b8", "#224c23", "#ea880b"],
                    ["#333214", "#03cd8b", "#edd617", "#dc1904", "#4913cd"],
                    ["#ec6102", "#2f0965", "#effd87", "#15f030", "#0373fb"],
                    ["#051e8e", "#c2046f", "#1cc5fc", "#28970c", "#f8b50d"],
                    ["#cefc26", "#11c20e", "#0b0961", "#2cd3f8", "#ab150c"],
                ]
            }
        }
    
        let index = Math.floor((Math.random() * setOfColors.length)) // zufälliges set 
        console.log("Color set index: " + index)
        this.colorsForImages = setOfColors[index]

        console.log("Colors: " + this.colorsForImages)

        return this.colorsForImages
    }

}
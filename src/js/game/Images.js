/*
 * Autoren: Dennis Loska, Luisa Kurth
 */

class Images {

    constructor(grayscale) {
        // pictures from the folder
        this.imageNames = [
            "light1.jpg", "light2.jpg", "light3.jpg", "light4.jpg", "light5.jpg",
            "typography1.jpg", "typography2.jpg", "typography3.jpg", "typography4.jpg", "typography5.jpg",
            "summer1.jpg", "summer2.jpg", "summer3.jpg", "summer4.jpg", "summer5.jpg",
            "cactus1.jpg", "cactus2.jpg", "cactus3.jpg", "cactus4.jpg", "cactus5.jpg",
            "veggie1.jpg", "veggie2.jpg", "veggie3.jpg", "veggie4.jpg", "veggie5.jpg",
            "architecture1.jpg", "architecture2.jpg", "architecture3.jpg", "architecture4.jpg", "architecture5.jpg",
            "eyecandy1.jpg", "eyecandy2.jpg", "eyecandy3.jpg", "eyecandy4.jpg", "eyecandy5.jpg",
            "sport1.jpg", "sport2.jpg", "sport3.jpg", "sport4.jpg", "sport5.jpg",
            "fruit1.jpg", "fruit2.jpg", "fruit3.jpg", "fruit4.jpg", "fruit5.jpg",
            "A3.jpg", "B3.jpg", "C3.jpg", "D3.jpg", "E3.jpg",
            "A3c.jpg", "B3c.jpg", "C3c.jpg", "D3c.jpg", "E3c.jpg", 
            "F1.jpg", "F2.jpg", "F3.jpg", "F4.jpg", "F5.jpg",
            "G1.jpg", "G2.jpg", "G3.jpg", "G4.jpg", "G5.jpg",
        ]
        //"A.jpg", "B.jpg", "C.jpg", "D.jpg", "E.jpg",
        //"A2.jpg", "B2.jpg", "C2.jpg", "D2.jpg", "E2.jpg",
        //"A3w.jpg", "B3w.jpg", "C3w.jpg", "D3w.jpg", "E3w.jpg",
        //"A3c.jpg", "B2.jpg", "C.jpg", "F4.jpg", "F.jpg",
        //"face1.png", "face2.png", "face3.png", "face4.png", "face5.png",
        //"W1.jpg", "W2.jpg", "W3.jpg", "W4.jpg", "W5.jpg",

        this.imageSet = Math.floor(Math.random() * 13) // 13 = imageNames.length / 5 (weil immer 5er sets)

        this.images = []
        this.numImages = undefined
        this.width = undefined
        this.height = undefined
        this.targetImgData = new Array()
        this.vertical = undefined // position of target images, where to draw
        this.empty = undefined // one empty image or not 
        this.similarShapes = undefined // images with similar position of shapes or not 
        this.gray = grayscale // images in grayscale or color
    }

    set numImage(num) {
        this.numImages = num
    }

    set position(state) {
        this.vertical = state
        // position of target images 
        // doGenerate = true, vertical = true -> target images in vertical column left
        // doGenrate = false, vertical = false -> target images in horizontal row on top
    }

    set emptyState(state){
        this.empty = state
    }

    set similarPositions(state){
        this.similarShapes = state
    }

    // Original JS event loop
    folderImages(callback) {
        this.images = new Array(this.numImages)
        try {
            let loadCounter = 0
            for (let i = 0; i < this.numImages; i++) {
                this.images[i] = new Image()
                let canvas
                if (this.vertical == true) // wohin sollen bilder gemalt werden?
                    canvas = document.getElementById("js-starting-image-" + i.toString())
                else canvas = document.getElementById("js-basis-image-" + i.toString())
                let ctx = canvas.getContext("2d")
                let img = this.images[i]

                img.onload = function () {
                    ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
                    this.images[i].width = canvas.width
                    this.images[i].height = canvas.height
                    let imgData = ctx.getImageData(0, 0, canvas.width, canvas.height)
                    this.targetImgData[i] = imgData.data
                    loadCounter++
                    if (loadCounter == this.numImages) {
                        debugger
                        this.width = this.images[i].width
                        this.height = this.images[i].height
                        callback(this.targetImgData)
                    }
                }.bind(this)
                this.images[i].src = "/img/image_sets/" + this.imageNames[i + this.imageSet * 5]
            }
        } catch (err) {
            console.log("Could not load image from folder.", err.message)
        }
    }

    get generatedImages() {
        // instanziiere ImageGenerator und rufe randomImagePixels() auf 
        this.images = new Array(this.numImages)
        let generator = new ImageGenerator(this.numImages, this.gray)

        // if level setting contains empty = true -> draw one image without shape
        let empty = this.empty // get from Level
        let indexOfEmptyImage = Math.floor((Math.random() * this.numImages))
        // random index for empty image so that it's not always in the same position / picture

        try {
            let targetImgData = new Array()
            for (let i = 0; i < this.numImages; i++) {
                this.images[i] = new Image()
                let canvas

                if (this.vertical == true) // wohin sollen bilder gemalt werden?
                    canvas = document.getElementById("js-starting-image-" + i.toString())
                else canvas = document.getElementById("js-basis-image-" + i.toString())

                let ctx = canvas.getContext("2d")
                let img = this.images[i]
                canvas.width = generator.width
                canvas.height = generator.height
                img.onload = function () {
                    ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
                }
                this.images[0].width = canvas.width
                this.images[0].height = canvas.height
                let imgData = ctx.getImageData(0, 0, canvas.width, canvas.height)

                // get random pixel array from ImageGenerator
                let generatedPixels = generator.randomImagePixels
                imgData.data.set(generatedPixels)
                ctx.putImageData(imgData, 0, 0)

                // put random shape of random color on picture
                if(empty == true && i == indexOfEmptyImage){
                    //console.log("Do not draw shapes for image position " + i)
                } else{
                    generator.addShapes(ctx, i, this.similarShapes) // false = draw shape
                }

                let imgDataWithShapes = ctx.getImageData(0, 0, canvas.width, canvas.height)
                targetImgData.push(imgDataWithShapes.data)
            }
            this.targetImgData = targetImgData
        } catch (err) {
            console.log("Could not load image from generator.", err.message)
        }
        this.width = this.images[0].width
        this.height = this.images[0].height
    }

    get targetPixels() {
        let targetPixels = this.targetImgData
        return targetPixels
    }
}
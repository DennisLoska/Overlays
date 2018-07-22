class Images {

    // TODO: take out matrix as parameter for constructor when take out seed and tests!!
    constructor(matrix, grayscale) {
        this.imageNames = [
            "A2.jpg", "B2.jpg", "C2.jpg", "D2.jpg", "E2.jpg", // 0
            "A3.jpg", "B3.jpg", "C3.jpg", "D3.jpg", "E3.jpg", // 1
            "A3w.jpg", "B3w.jpg", "C3w.jpg", "D3w.jpg", "E3w.jpg", // 2
            "A3c.jpg", "B3c.jpg", "C3c.jpg", "D3c.jpg", "E3c.jpg", // 3
            "A.jpg", "B.jpg", "C.jpg", "D.jpg", "E.jpg", // 4
            "F1.jpg", "F2.jpg", "F3.jpg", "F4.jpg", "F5.jpg", // 5
            "G1.jpg", "G2.jpg", "G3.jpg", "G4.jpg", "G5.jpg", // 6
            "A3c.jpg", "B2.jpg", "C.jpg", "F4.jpg", "F.jpg", // 7
            "face1.png", "face2.png", "face3.png", "face4.png", "face5.png", // 8
            "W1.jpg", "W2.jpg", "W3.jpg", "W4.jpg", "W5.jpg", // 9
            "F1.jpg", "F2.jpg", "F3.jpg", "F4.jpg", "F5.jpg" // 10
        ]
        this.imageSet = Math.floor(Math.random() * 11) + 0
        this.images = []
        this.imageData = []
        this.numImages = undefined
        this.width = undefined
        this.height = undefined
        this.targetImgData = new Array()
        this.vertical = undefined // position of target images, where to draw
        this.empty = undefined

        this.mInv = matrix
        this.gray = grayscale
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

    // Original JS event loop
    folderImages(callback) {
        this.images = new Array(this.numImages)
        try {
            //let targetImgData = new Array()
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
                    console.log("TargetImgData in Images-Loop:", this.targetImgData)
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
        // instanziiere ImageGenerator und rufe randomImage() auf 
        console.log("Generated images used.")
        this.images = new Array(this.numImages)

        let seed = Math.floor(Math.random() * 1001) // generiert random Zahl zwischen 0 und 500 
        // save good seed values: 474, 193, 4, 229, 221, 324, 112, 131, 378
        let generator = new ImageGenerator(seed, this.numImages, this.mInv, this.gray)

        // if level setting contains empty = true -> draw one image without shape
        let empty = this.empty // get from Level
        console.log("Empty: " + empty)
        let indexOfEmptyImage = Math.floor((Math.random() * this.numImages))
        console.log("Index for empty image: " + indexOfEmptyImage)
        // random index for empty image so that it's not always in the same position / picture

        try {
            let targetImgData = new Array()
            for (let i = 0; i < this.numImages; i++) {
                //let generator = new ImageGenerator()
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
                // generator.addShapes(ctx, i, false) // i = index of image
                // i = index of image, false = not empty
                if(empty == true && i == indexOfEmptyImage){
                    // Zeile kann man auch ganz weglassen, falls in addShapes sonst nichts anderes mehr passiert
                    // empty kann man als Parameter in Methode dann ganz weglassen
                    generator.addShapes(ctx, i, true) // don't draw shape
                } else{
                    generator.addShapes(ctx, i, false) // draw shape
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
        return this.images
    }

    get targetPixels() {
        let targetPixels = this.targetImgData
        console.log("Debug Targetpixels:", targetPixels)
        return targetPixels
    }
}
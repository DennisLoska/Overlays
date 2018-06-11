class Images {

    constructor() {
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
        this.targetImgData = undefined
    }

    set numImage(num) {
        this.numImages = num
    }

    get folderImages() {
        this.images = new Array(this.numImages)
        try {
            let targetImgData = new Array()
            for (let i = 0; i < this.numImages; i++) {
                this.images[i] = new Image()
                let j = i
                j++
                let canvas = document.getElementById("js-starting-image-" + j.toString())
                    //console.log("Canvas number " + j + ":" + "\n");
                    //console.log(canvas)
                let ctx = canvas.getContext("2d")
                let img = this.images[i]
                img.onload = function() {
                    ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
                }
                this.images[0].width = canvas.width
                this.images[0].height = canvas.height
                this.images[i].src = "/img/image_sets/" + this.imageNames[i + this.imageSet * 5]
                    //console.log("Image number " + i + ":" + "\n")
                    //console.log(this.images[i])
                let imgData = ctx.getImageData(0, 0, canvas.width, canvas.height)
                targetImgData.push(imgData.data)
            }
            this.targetImgData = targetImgData
        } catch (err) {
            console.log("Could not load image from folder.")
            err.message = "Could not load image from folder."
        }
        //console.log("All images: ")
        //console.log(this.images)
        this.width = this.images[0].width
        this.height = this.images[0].height
        return this.images
    }

    get generatedImages() {
        //TODO ImageGenerator
        // instanziiere ImageGenerator und rufe randomImage() auf 
        console.log("Generated images used.")
        this.images = new Array(this.numImages)
        try {
            let targetImgData = new Array()
            for (let i = 0; i < this.numImages; i++) {
                let generator = new ImageGenerator()
                this.images[i] = new Image()
                let j = i
                j++
                let canvas = document.getElementById("js-starting-image-" + j.toString())
                let ctx = canvas.getContext("2d")
                let img = this.images[i]
                canvas.width = generator.width
                canvas.height = generator.height
                img.onload = function() {
                    ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
                }
                this.images[0].width = canvas.width
                this.images[0].height = canvas.height
                let imgData = ctx.getImageData(0, 0, canvas.width, canvas.height)

                // get random pixel array from ImageGenerator
                let generatedPixels = generator.randomImagePixels
                imgData.data.set(generatedPixels)
                    //console.log("Generated pixels:")
                    //console.log(generatedPixels)
                    //console.log("imgData.data:")
                    //console.log(imgData.data)
                ctx.putImageData(imgData, 0, 0)

                // put random shape of random color on picture
                generator.addShapes(ctx)

                targetImgData.push(imgData.data)
            }
            this.targetImgData = targetImgData
        } catch (err) {
            console.log("Could not load image from generator.")
            err.message = "Could not load image from generator."
        }
        this.width = this.images[0].width
        this.height = this.images[0].height
        return this.images
    }

    get targetPixels() {
        let targetPixels = this.targetImgData
        console.log("Debug Targetpixels:")
        console.log(targetPixels)
        return targetPixels
    }
}
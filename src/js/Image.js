class Image {

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
        this.numImages = undefined
        this.width = undefined
        this.height = undefined
    }

    set numImages(num) {
        this.numImages = num
    }

    get images() {
        this.images = new Array[this.numImages]
        try {
            for (let i = 0; i < this.numImages; i++) {
                this.images[i] = new Image()
                this.images[i].src = "/img/image_sets/" + this.imageNames[i + this.imageSet * 5]
            }
        } catch (err) {
            this.images[i].src = err.message
        }
        this.width = this.images[0].width
        this.height = this.images[0].height
        return this.images
    }

    get generatedImages() {
        //TODO ImageGenerator
    }

    get targetPixels() {
        let targetPixels = new Array(this.numImages, this.width * this.height)
        for (let i = 0; i < this.numImages; i++) {
            let canvas = document.createElement('canvas')
            let context = canvas.getContext('2d')
            let img = this.images[i]
            canvas.width = img.width
            canvas.height = img.height
            context.drawImage(img, 0, 0)
            let imageData = context.getImageData(0, 0, img.width, img.height)
            let imagePixels = imageData.data
            targetPixels[i] = imagePixels
        }
        return targetPixels
    }
}
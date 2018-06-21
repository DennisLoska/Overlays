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
        this.targetImgData = new Array()

        this.vertical = undefined // position of target images, where to draw
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

    /*
        https://www.html5canvastutorials.com/tutorials/html5-canvas-image-loader/
        https://stackoverflow.com/questions/4123906/javascript-image-onload-callback-to-object-function
        https://stackoverflow.com/questions/10652513/html5-dynamically-create-canvas#10652568
    */
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
                        console.log("callback executed")
                        
                        callback(this.targetImgData)
                    }
                }.bind(this)
                this.images[i].src = "/img/image_sets/" + this.imageNames[i + this.imageSet * 5]
            }
        } catch (err) {
            console.log("Could not load image from folder.", err.message)
        }
    }
    
    // 4.Ansatz - jQuery Deferred
/*
    folderImages(callback) {
        this.images = new Array(this.numImages)
        try {
            //let targetImgData = new Array()
            for (let i = 0; i < this.numImages; i++) {
                $.loadImage = function (i) {
                    // Define a "worker" function that should eventually resolve or reject the deferred object.
                    var loadImage = function (deferred) {
                        this.images[i] = new Image()
                        let canvas
                        if (this.vertical == true) // wohin sollen bilder gemalt werden?
                            canvas = document.getElementById("js-starting-image-" + i.toString())
                        else canvas = document.getElementById("js-basis-image-" + i.toString())
                        let ctx = canvas.getContext("2d")
                        let url = "/img/image_sets/" + this.imageNames[i + this.imageSet * 5]
                        // Set up event handlers to know when the image has loaded
                        // or fails to load due to an error or abort.
                        debugger
                        this.images[i].onload = loaded();
                        this.images[i].onerror = errored(); // URL returns 404, etc
                        this.images[i].onabort = errored(); // IE may call this if user clicks "Stop"

                        // Setting the src property begins loading the image.
                        this.images[i].src = url;

                        function loaded() {
                            debugger
                            console.log("ctx", ctx);
                            console.log("this.images[i]", this.images[i]);


                            ctx.drawImage(this.images[i], 0, 0, canvas.width, canvas.height)
                            this.images[i].width = canvas.width
                            this.images[i].height = canvas.height
                            let imgData = ctx.getImageData(0, 0, canvas.width, canvas.height)
                            this.targetImgData[i] = imgData.data
                            console.log("executed load:", this.targetImgData);

                            unbindEvents();
                            // Calling resolve means the image loaded sucessfully and is ready to use.
                            deferred.resolve();
                        }

                        function errored() {
                            unbindEvents();
                            // Calling reject means we failed to load the image (e.g. 404, server offline, etc).
                            console.log("errored - failed to load image.", this.images);
                            deferred.reject();
                        }

                        function unbindEvents() {
                            // Ensures the event callbacks only get called once.
                            this.images[i].onload = null;
                            this.images[i].onerror = null;
                            this.images[i].onabort = null;
                        }
                    }.bind(this);
                    // Create the deferred object that will contain the loaded image.
                    // We don't want callers to have access to the resolve() and reject() methods, 
                    // so convert to "read-only" by calling `promise()`.
                    return $.Deferred(loadImage).promise();
                }.bind(this);
                debugger
                $.loadImage(i)
                    .done(function () {
                        console.log("TargetImgData:", this.targetImgData);
                        if (i == this.numImages - 1) {
                            this.width = this.images[i].width
                            this.height = this.images[i].height
                            callback(this.images, this.targetImgData)
                        }
                    }.bind(this))
                    .fail(function () {
                        i--;
                        alert("Failed to load image");
                    });
            }
        } catch (err) {
            console.log("Could not load image from folder.", err.message)
        }
        //console.log("All images: ")
        //console.log(this.images)

        //return this.images
    }
*/
    //3. Ansatz Callback again with some apsects from cache-"solution"

    /*
    loadImages(loadCallback, callback) {
        this.images = new Array(this.numImages)
        for (let i = 0; i < this.numImages; i++) {
            this.images[i] = new Image()
            let canvas
            let loadedImages = i
            if (this.vertical == true) // wohin sollen bilder gemalt werden?
                canvas = document.getElementById("js-starting-image-" + i.toString())
            else canvas = document.getElementById("js-basis-image-" + i.toString())
            let ctx = canvas.getContext("2d")

            this.images[i].onload = function () {
                if (++loadedImages >= this.numImages)
                    loadCallback()
                this.images[i].width = canvas.width
                this.images[i].height = canvas.height
                let imgData = ctx.getImageData(0, 0, canvas.width, canvas.height)
                this.targetImgData[i] = imgData.data
                console.log("TargetImgData in onload of folderImages:", this.targetImgData)
                if (i == this.numImages - 1) {
                    this.width = this.images[i].width
                    this.height = this.images[i].height
                    callback(this.images, this.targetImgData)
                }
            }.bind(this)
            this.images[i].src = "/img/image_sets/" + this.imageNames[i + this.imageSet * 5]
        }
    }

    folderImages(callback) {
        debugger
        try {
            this.loadImages(function () {
                for (let i = 0; i < this.numImages; i++) {
                    let canvas
                    if (this.vertical == true) // wohin sollen bilder gemalt werden?
                        canvas = document.getElementById("js-starting-image-" + i.toString())
                    else canvas = document.getElementById("js-basis-image-" + i.toString())
                    let ctx = canvas.getContext("2d")
                    ctx.drawImage(this.images[i], 0, 0, canvas.width, canvas.height)
                }
            }.bind(this), callback)
        } catch (err) {
            console.log("Could not load image from folder.", err.message)
        }
    }
*/


    //2. Ansatz Cache

    /*
    loadIntoCache(callback) {
        let images = new Array(this.imageNames.length)
        try {
            for (let i = 0; i < this.imageNames.length; i++) {
                let loadedImages = i
                let canvas = document.createElement('canvas')
                let ctx = canvas.getContext("2d")
                images[i] = new Image()
                images[i].onload = function () {
                    if(++loadedImages >= this.imageNames.length)
                        callback(images,ctx,i,canvas)
                }.bind(this)
                images[i].src = "/img/image_sets/" + this.imageNames[i]
            }
        } catch (err) {
            console.log("Could not load image to cache", err.message)
        }
    }

    folderImages(callback) {
        this.images = new Array(this.numImages)
        try {
            for (let i = 0; i < this.numImages; i++) {
                let counter = i
                this.images[i] = new Image()
                let canvas
                if (this.vertical == true) // wohin sollen bilder gemalt werden?
                    canvas = document.getElementById("js-starting-image-" + i.toString())
                else canvas = document.getElementById("js-basis-image-" + i.toString())
                let ctx = canvas.getContext("2d")
                this.images[i].onload = function () {
                    ctx.drawImage(this.images[i], 0, 0, canvas.width, canvas.height)
                    this.images[i].width = canvas.width
                    this.images[i].height = canvas.height
                    let imgData = ctx.getImageData(0, 0, canvas.width, canvas.height)
                    this.targetImgData[i] = imgData.data
                    console.log("TargetImgData in onload of folderImages:", this.targetImgData)
                    if (i < this.numImages - 1) {
                        this.width = this.images[i].width
                        this.height = this.images[i].height
                        callback(this.images, this.targetImgData)
                    }
                }.bind(this)
                this.images[i].src = "/img/image_sets/" + this.imageNames[i + this.imageSet * 5]
            }
        } catch (err) {
            console.log("Could not load image from folder.", err.message)
        }
    }

    */

    //1. ansatz Callback
    /*
    loadImages(i, canvas, ctx, img, callback, addSrcCallback) {
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
        this.images[i].width = canvas.width
        this.images[i].height = canvas.height
        let imgData = ctx.getImageData(0, 0, canvas.width, canvas.height)
        this.targetImgData[i] = imgData.data
        console.log("TargetImgData in onload of folderImages:", this.targetImgData)
        if (i == this.numImages - 1) {
            this.width = this.images[0].width
            this.height = this.images[0].height
            addSrcCallback(callback)
        }
    }

    folderImages(callback) {
        this.images = new Array(this.numImages)
        try {
            for (let i = 0; i < this.numImages; i++) {
                this.images[i] = new Image()
                let canvas
                if (this.vertical == true) // wohin sollen bilder gemalt werden?
                    canvas = document.getElementById("js-starting-image-" + i.toString())
                else canvas = document.getElementById("js-basis-image-" + i.toString())
                let ctx = canvas.getContext("2d")
                let img = this.images[i]
                img.onload = this.loadImages(i, canvas, ctx, img, callback, function (callback) {
                    callback(this.images, this.targetImgData)
                }.bind(this))
                this.images[i].src = "/img/image_sets/" + this.imageNames[i + this.imageSet * 5]
            }
        } catch (err) {
            console.log("Could not load image from folder.", err.message)
        }
    }

    */

    get generatedImages() {
        // instanziiere ImageGenerator und rufe randomImage() auf 
        console.log("Generated images used.")
        this.images = new Array(this.numImages)
        try {
            let targetImgData = new Array()
            for (let i = 0; i < this.numImages; i++) {
                let generator = new ImageGenerator()
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
                generator.addShapes(ctx)
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
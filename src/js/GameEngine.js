class GameEngine {
    constructor(levelNumber) {
        this.levelNumber = levelNumber
        this.loadLevel()

        this.wUser = new Array(this.numPics, this.numPics) // matrix der userwauswahl 
        this.userImagesPixels = new Array(this.numPics, this.width * this.height) // kombinierte pixel der userauswahl
        this.correctUserCombinations = new Array(this.numPics) // 1 wenn richtige kombination, 0 wenn falsch

        var targetImages = new Array(this.numPics)
        var basisImages = new Array(this.numPics)

        this.getTargetAndBasisImages();
    }

    loadLevel() {
        // load the settings for a specific level
        this.level = new Level(this.levelNumber);
        this.numPics = level.numPics;
        this.numOnes = level.numOnes;
        this.doGenerate = level.doGenerate();
    }

    get numPics() {
        return this.numPics
    }

    get numOnes() {
        return this.numOnes
    }

    get height() {
        return this.height;
    }

    get width() {
        return this.width;
    }

    getTargetAndBasisImages() {
        // lade die grundlegenden Bilder (aus dem pics Ordner oder mit dem generator)
        let images = new Images();
        images.setNumImages(numPics); // generiere bilder mit returnGeneratedImages()

        // für die ersten 3 Level generierte Bilder nehmen, danach wieder die Images aus dem Ordner 

        if (doGenerate == true) {
            // generate basis from input images

            if (levelNumber < 3) {
                targetImages = images.returnGeneratedImages(); // ImageGenerator Bilder
            } else {
                targetImages = images.returnImages(); // Bilder aus pics Ordner
            }
            targetPixels = images.returnTargetPixels();

            this.width = targetImages[0].getWidth();
            this.height = targetImages[0].getHeight();
        } else {
            // read basis images

            if (levelNumber < 3) {
                basisImages = images.returnGeneratedImages(); // ImageGenerator Bilder
            } else {
                basisImages = images.returnImages(); // Bilder aus pics Ordner
            }

            this.width = basisImages[0].getWidth();
            this.height = basisImages[0].getHeight();
        }

        calculateBasisAndTargetImages();
    }

}


















































































//https://developer.mozilla.org/de/docs/Web/API/Canvas_API/Tutorial/Pixel_manipulation_with_canvas
//https://www.w3schools.com/tags/canvas_getimagedata.asp
function canvasDemo() {

    var img_1 = new Image;
    var img_2 = new Image;

    var c_1 = document.getElementById("js-starting-image-1");
    var ctx_1 = c_1.getContext("2d");
    img_1.onload = function() {
        ctx_1.drawImage(img_1, 0, 0, c_1.width, c_1.height); // Or at whatever offset you like
    };
    img_1.src = "/img/image_sets/D2.png";

    var c_2 = document.getElementById("js-starting-image-2");
    var ctx_2 = c_2.getContext("2d");
    img_2.onload = function() {
        ctx_2.drawImage(img_2, 0, 0, c_2.width, c_2.height); // Or at whatever offset you like
    };
    img_2.src = "/img/image_sets/F5.jpg";

    var c_3 = document.getElementById("js-basis-image-1");
    var ctx_3 = c_3.getContext("2d");

    var imgData_1 = ctx_1.getImageData(0, 0, c_1.width, c_1.height);
    var imgData_2 = ctx_2.getImageData(0, 0, c_2.width, c_2.height);
    var bufferData = ctx_3.getImageData(0, 0, c_3.width, c_3.height);

    var data = imgData_1.data;
    var data1 = imgData_2.data;
    var buffer = bufferData.data;

    // enumerate all pixels
    // each pixel's r,g,b,a datum are stored in separate sequential array elements
    for (var i = 0; i < data.length; i += 4) {
        var red_1 = data[i];
        var green_1 = data[i + 1];
        var blue_1 = data[i + 2];

        var red_2 = data1[i];
        var green_2 = data1[i + 1];
        var blue_2 = data1[i + 2];

        //stupid test
        buffer[i] = red_2 / 2 + red_1 / 4;
        buffer[i + 1] = green_2 / 2 + green_1 / 4;
        buffer[i + 2] = blue_2 / 2 + blue_1 / 3;
        buffer[i + 3] = 255 //alpha
    }
    ctx_3.putImageData(bufferData, 0, 0);
}
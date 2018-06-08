class ImageGenerator {

    constructor() {
        this.width = 150;
        this.height = 150;

        this.randomImage = new Image();
        randomImage.setAttribute("height", height); // "150"
        randomImage.setAttribute("width", width);
        
        var canvas = document.getElementById("js-starting-image-" + j.toString());
        var context = canvas.getContext("2d");
        var imgData = context.createImageData(width,height);

        var randomR = Math.floor((Math.random() * 255) + 1);
        var randomG = Math.floor((Math.random() * 255) + 1);
        var randomB = Math.floor((Math.random() * 255) + 1);

        for (var i = 0; i < imgData.data.length; i+=4){
             imgData.data[i+0] = randomR; // R
             imgData.data[i+1] = randomG; // G
             imgData.data[i+2] = randomB; // B
             imgData.data[i+3] = 255; // A
         }
         context.putImageData(imgData,0,0);
	}

	get randomImage() {
		return this.randomImage; // Change: retrun the context image data 
	}

}
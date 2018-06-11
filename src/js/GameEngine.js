class GameEngine {
    constructor(levelNumber) {
        this.levelNumber = levelNumber
        this.loadLevel()

        this.wUser = new Array(this.numPics, this.numPics) // matrix der userwauswahl 
        this.userImagesPixels = new Array(this.numPics, this.width * this.height) // kombinierte pixel der userauswahl
        this.correctUserCombinations = new Array(this.numPics) // 1 wenn richtige kombination, 0 wenn falsch

        let targetImages = new Array(this.numPics)
        let basisImages = new Array(this.numPics)

        for (let i = 0; i < targetImages.length; i++)
            targetImages[i] = new Image()
        for (let i = 0; i < basisImages.length; i++)
            basisImages[i] = new Image()

        this.targetImages = targetImages
        this.basisImages = basisImages

        this.m = new Array(undefined, undefined)
        this.mInv = []
        this.targetPixels = new Array(undefined, undefined)
        this.basisPixels3 = new Array(undefined, undefined, undefined)

        this.maxWeight = 1; // 0.51, 0.71.. 2.01
        this.width = undefined
        this.height = undefined

        this.getTargetAndBasisImages()
    }

    loadLevel() {
        // load the settings for a specific level
        this.level = new Level(this.levelNumber)
        this.numPics = this.level.numPics
        this.numOnes = this.level.numOnes
        this.doGenerate = this.level.doGenerate()
    }

    returnScore(clicks) {
        let score = 0
        let maximum = this.level.clickMaximum()
        let optimum = this.level.clickOptimum()

        if (score == optimum)
            score = 100
        else if (score >= maximum)
            score = 0
        return score
    }

    calculateUserImage(wUserRow, index){   // TODO: not finished
        // berechnet das Ergebnisbild basierend auf der Matrixauswahl des Users 
        // muss für jede Reihe einzelnd aufgerufen werden
        var pixelsBlended = new Array();
		pixelsBlended = blend3DDoubleToPixels(this.basisPixels3, wUserRow); // calculates pixels for resulting image
		var userImage =  new BufferedImage(width, height, BufferedImage.TYPE_INT_ARGB);
		userImage.setRGB(0, 0, width, height, pixelsBlended, 0, width);
		userImagesPixels[index] = pixelsBlended;
		return userImage;
    }
    
    comparePictures(index, wUserRow){   // TODO: not finished
		// compare the combination by the user with the target image
		// compare the solution matrix m with what the user clicked wUserRow
		// int index is one specific row in the matrix
		var equals = false;
		for(let i = 0; i < numPics; i++){
			if(wUserRow[i] == m[index][i]){ // vergleiche reihe der usermatrix mit reihe der lösungsmatrix
				equals = true;
			} else{
				return false;
			}
		}
		return equals;
    }
    
    getAmountOfCorrectCombinations() {
		// count how many combinations the user has right at the same time
		// if correctCombinations == numPics -> finished, switch to next level
		var correctCombinations = 0;
		for(let i = 0; i < correctUserCombinations.length; i++){
			if(correctUserCombinations[i] > 0){
				correctCombinations++;
			}
		}
		return correctCombinations;
    }
    
    setCorrectCombination(index, value) {
        // set the combinations by the user (per row)
        // wenn eine Reihe die richtige Lösung ergibt, dann ist correctCombinations = 1, wenn falsch dann = 0
		if(value == true){
			correctUserCombinations[index] = 1;
		} else{
			correctUserCombinations[index] = 0;
		}
    }
    
    getUserMatrixValue(row, col){
        // return den value (0 oder 1) an einer bestimmten stelle in der auswahl des users
		return this.wUser[row][col];
	}
	
	setUserMatrixValue(row, col, value){
		this.wUser[row][col] = value;
	}

    getTargetAndBasisImages() {
        // lade die grundlegenden Bilder (aus dem pics Ordner oder mit dem generator)
        let images = new Images()
        images.numImage = this.numPics // generiere bilder mit returnGeneratedImages()

        console.log(images);

        // für die ersten 3 Level generierte Bilder nehmen, danach wieder die Images aus dem Ordner 
        if (this.doGenerate == true) {
            // generate basis from input images
            if (this.levelNumber < 3)
                this.targetImages = images.generatedImages // ImageGenerator Bilder
            else this.targetImages = images.folderImages // Bilder aus pics Ordner
            this.targetPixels = images.targetPixels
            this.width = this.targetImages[0].width
            this.height = this.targetImages[0].height
        } else {
            // read basis images
            if (this.levelNumber < 3)
                this.basisImages = images.generatedImages // ImageGenerator Bilder
            else this.basisImages = images.folderImages // Bilder aus pics Ordner

            this.width = this.basisImages[0].width
            this.height = this.basisImages[0].height
        }
        this.calculateBasisAndTargetImages()
    }

    calculateBasisAndTargetImages() {
        if (this.doGenerate == true) { // generate basis from input images
            this.findCombinations() // finde eine Konfiguration m mit Zeilensummen von mInv > 0

            let pixelsBasis = new Array(this.numPics)
            this.basisPixels3 = new Array(this.numPics, undefined, undefined)
            this.basisImages = new Array(this.numPics) // Basisbilder zum Anzeigen

            for (let i = 0; i < this.numPics; i++) {
                this.basisPixels3[i] = this.blendPixelsTo3DDoubleImage(this.targetPixels, this.mInv[i])
                pixelsBasis[i] = this.blendPixelsToPixels(this.targetPixels, this.mInv[i])

                //basisImages[i] = new BufferedImage(width, height, BufferedImage.TYPE_INT_ARGB);
                //basisImages[i].setRGB(0, 0, width, height, pixelsBasis[i], 0, width); //Sets an array of integer pixels in the default RGB color model 
                //this.basisImages[i] = new Image()
                this.basisImages[i] = this.calculateSetRGB(pixelsBasis[i])
            }
        } else {
            this.mInv = new Array(this.numPics, this.numPics)
            let pixelsBasis = Array(this.numPics, this.width * this.height)
            for (let i = 0; i < this.numPics; i++) {
                this.mInv[i][i] = 1 //1./numOnes;
                this.basisPixels3 = new Array(this.numPics, undefined, undefined)

                //this.basisImages[i].getRGB(0, 0, width, height, pixelsBasis[i], 0, width) //returns an array of integer pixels in the default RGB color model
                this.basisImages[i] = this.calculateGetRGB(pixelsBasis[i])
            }
            for (let i = 0; i < this.numPics; i++) {
                this.basisPixels3[i] = this.blendPixelsTo3DDoubleImage(pixelsBasis, this.mInv[i])
            }

            this.generateRandomM()

            this.targetPixels = new Array(this.numPics, this.width * this.height)

            for (let i = 0; i < targetPixels.length; i++) {
                this.targetPixels[i] = this.blend3DDoubleToPixels(this.basisPixels3, this.m[i])

                //this.targetImages[i] = new BufferedImage(width, height, BufferedImage.TYPE_INT_ARGB)
                //this.targetImages[i].setRGB(0, 0, width, height, targetPixels[i], 0, width) //Sets an array of integer pixels in the default RGB color model 
                //this.targetImages[i] = new Image()
                this.targetImages[i] = this.calculateSetRGB(pixelsBasis[i])
            }
        }
        printResult()
        drawImagesInCanvas()
    }

    drawImagesInCanvas(){ // // TODO: not finished
        // draw the calcuated images into the canvas gui
        var imagesToDraw = new Array(this.numPics)

        // which images should be drawn
        if(doGenerate == true){
            imagesToDraw = this.basisImages
        } else{
            imagesToDraw = this.tragetImages
        }

        /*
        try {
            let targetImgData = new Array()
            for (let i = 0; i < this.numImages; i++) {
                this.imagesToDraw[i] = new Image()
                let j = i
                j++
                let canvas = document.getElementById("js-basis-image-" + j.toString())
                let ctx = canvas.getContext("2d")
                let img = imagesToDraw[i]
                img.onload = function() {
                    ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
                }
                this.imagesToDraw[0].width = canvas.width
                this.imagesToDraw[0].height = canvas.height
                this.imagesToDraw[i].src = "/img/image_sets/" + this.imageNames[i + this.imageSet * 5]

                let imgData = ctx.getImageData(0, 0, canvas.width, canvas.height)
                targetImgData.push(imgData.data)
            }
            this.imagesToDraw = targetImgData
        } catch (err) {
            console.log("Could not load image from folder.")
            err.message = "Could not load image from folder."
        }*/
    }

    calculateSetRGB(pixels) {
        //TODO - should set the pixels of an existing image

    }
    calculateGetRGB(pixels) {
        //TODO - should return an image - generated by using a given array of pixels
        
        /*let imgPixels = new Uint8ClampedArray(pixels.length)
        for (var i = 0; i < imgPixels.length; i++) {
            imgPixels[i + 0] = pixels[i + 0]; //randomR; // R
            imgPixels[i + 1] = pixels[i + 1]; //randomG; // G
            imgPixels[i + 2] = pixels[i + 2]; //randomB; // B
            imgPixels[i + 3] = pixels[i + 3]; // A
        }

        var img = new Image();
        img.onload = function () {
            ctx.drawImage(img, 0, 0, img.width, img.height); // draw the image on the canvas
        }*/
    }

    findCombinations() {
        let success
        let tries = 0
        do {
            this.generateRandomM()
            success = true
            this.mInv = InverseMatrix.invert(this.m)
            console.log("Inverted Matrix:");
            console.log(this.mInv);
            for (let i = 0; i < this.mInv.length; i++) {
                for (let j = 0; j < this.mInv[i].length; j++) {
                    let val = this.mInv[i][j]
                    if (!isFinite(val) || isNaN(val))
                        success = false // wenn Rang zu klein ist
                    else if (Math.abs(val) > this.maxWeight) // kein Bild stärker als mit maxContribution gewichten
                        success = false
                }
            }
        } while (!success && tries++ < 10000)

        if (!success)
            throw new Error("Impossible Settings, aborting")
    }

    generateRandomM() {
        let success
        do {
            // numOnes mal eine 1 in jede Zeile von m setzen	
            this.m = new Array(this.numPics)
            for (let i = 0; i < this.m.length; i++) {
                let index
                this.m[i] = new Array(this.numPics)
                for (let j = 0; j < this.m[i].length; j++)
                    this.m[i][j] = 0
                do index = Math.floor(Math.random() * this.numPics) + 0
                while (this.m[i][index] == 1)
                this.m[i][index] = 1
            }
            success = true
            for (let i = 0; i < this.numPics; i++) {
                for (let j = i + 1; j < this.numPics; j++) {
                    let same = true; // identische Kombinationen/Zeilen vermeiden
                    for (let k = 0; k < this.numPics; k++)
                        if (this.m[i][k] != this.m[j][k])
                            same = false
                    if (same) {
                        success = false
                        break
                    }
                }
            }
        } while (!success)
        console.log("Random Matrix:");
        console.log(this.m);
    }

    //TODO make function applyable on pixels from imagedata of Canvas-API
    blendPixelsTo3DDoubleImage(pixelsIn, w) {
        console.log(pixelsIn);
        let pixels = new Uint8ClampedArray(this.width * this.height * 4)

        for (var y = 0; y < this.height; y++) {
            for (var x = 0; x < this.width; x++) {
                var pos = (y * this.width + x) * 4; // position in buffer based on x and y
                this.rndImagePixels[pos + 0] = white; //randomR; // R
                this.rndImagePixels[pos + 1] = white; //randomG; // G
                this.rndImagePixels[pos + 2] = white; //randomB; // B
                this.rndImagePixels[pos + 3] = 255; // A

                let r = 0,
                    g = 0,
                    b = 0;


                let cj = pixelsIn[j][i]
                let rj = this.f((cj >> 16) & 255)
                let gj = this.f((cj >> 8) & 255)
                let bj = this.f((cj) & 255)

                r += w[j] * rj
                g += w[j] * gj
                b += w[j] * bj

                pixels[i][0] = this.fi(r)
                pixels[i][1] = this.fi(g)
                pixels[i][2] = this.fi(b)
            }
        }
        /*
                let pixels = new Array(pixelsIn[0].length, 3)

                for (let i = 0; i < pixels.length; i++) {
                    let r = 0,
                        g = 0,
                        b = 0;

                    for (let j = 0; j < pixelsIn.length; j++) {
                        let cj = pixelsIn[j][i]
                        let rj = this.f((cj >> 16) & 255)
                        let gj = this.f((cj >> 8) & 255)
                        let bj = this.f((cj) & 255)

                        r += w[j] * rj
                        g += w[j] * gj
                        b += w[j] * bj
                    }

                    pixels[i][0] = this.fi(r)
                    pixels[i][1] = this.fi(g)
                    pixels[i][2] = this.fi(b)
                }
                */
        return pixels
    }

    blend3DDoubleToPixels(pixelsIn, w) { // TODO: not finished
        // Ursprüngliche Parameter der Methode: (double[][][] pixelsIn, double[] w)
        //int[] pixels = new int[pixelsIn[0].length];
        var pixels = new Array(pixelsIn[0].length);

		var rMin = 0, rMax = 255;
		var gMin = 0, gMax = 255;
		var bMin = 0, bMax = 255;
		
		for (var i = 0; i < pixels.length; i++) {
			var r = 0, g = 0, b = 0;

			for (var j = 0; j < pixelsIn.length; j++) {
				var rj = f( pixelsIn[j][i][0]);
				var gj = f( pixelsIn[j][i][1]);
				var bj = f( pixelsIn[j][i][2]);	

				r += w[j]*rj; 
				g += w[j]*gj;
				b += w[j]*bj;
			}
			r = fi(r);
			g = fi(g);
			b = fi(b);

			if (r > rMax) rMax = r;
			if (r < rMin) rMin = r;
			if (g > gMax) gMax = g;
			if (g < gMin) gMin = g;
			if (b > bMax) bMax = b;
			if (b < bMin) bMin = b;
		}
		
		var max = Math.max(rMax, Math.max(gMax,  bMax));
		var min = Math.min(rMin, Math.min(gMin,  bMin));
				
		//console.log(rMin + "," + rMax + ", " + gMin + "," + gMax + ", " + bMin + "," + bMax );
		
		for (var i = 0; i < pixels.length; i++) {
			var r = 0, g = 0, b = 0;

			for (var j = 0; j < pixelsIn.length; j++) {
				var rj = f( pixelsIn[j][i][0]);
				var gj = f( pixelsIn[j][i][1]);
				var bj = f( pixelsIn[j][i][2]);	

				r += w[j]*rj; 
				g += w[j]*gj;
				b += w[j]*bj;
			}
			r = fi(r);
			g = fi(g);
			b = fi(b);		
			
			r = (r-min)*255/(max-min);
			g = (g-min)*255/(max-min);
			b = (b-min)*255/(max-min);
			
			//g = Math.min(Math.max(0, fi(g) ), 255);
			//b = Math.min(Math.max(0, fi(b) ), 255);
            //pixels[i] = 0xFF000000 | ((int)r <<16) | ((int)g << 8) | (int)b;
                        pixels[i] = r
            pixels[i + 1] = g
            pixels[i + 2] = b
            pixels[i + 3] = 255 //alpha
		}
		
		return pixels;
	}

    //TODO make function applyable on pixels from imagedata of Canvas-API
    blendPixelsToPixels(pixelsIn, w) {
        // w[i] sind gewichte - nehme ich das Bild (ja oder nein?)
        // fi damit verschiebt man die Werte zum Zerolevel (-128)
        let pixels = new Array(pixelsIn[0].length)

        for (let i = 0; i < pixels.length; i += 4) { // i+=4 WICHTIG!
            let r = 0,
                g = 0,
                b = 0;

            for (let j = 0; j < pixelsIn.length; j += 4) { // j+=4 WICHTIG!
                let cj = pixelsIn[j][i]
                let rj = this.f((cj >> 16) & 255)
                let gj = this.f((cj >> 8) & 255)
                let bj = this.f((cj) & 255)

                r += w[j] * rj
                b += w[j + 2] * bj
                g += w[j + 1] * gj
            }

            //r = (r - 128) / numOnes + 128;
            //g = (g - 128) / numOnes + 128;
            //b = (b - 128) / numOnes + 128;

            // begrenzung zwischen 0 und 255
            r = Math.min(Math.max(0, this.fi(r)), 255)
            g = Math.min(Math.max(0, this.fi(g)), 255)
            b = Math.min(Math.max(0, this.fi(b)), 255)
                //pixels[i] = 0xFF000000 | ((int)r <<16) | ((int)g << 8) | (int)b
            pixels[i] = r
            pixels[i + 1] = g
            pixels[i + 2] = b
            pixels[i + 3] = 255 //alpha
        }
        return pixels
    }

    f(val) {
        let zeroLevel = 128
        return val - zeroLevel
    }

    fi(val) {
        let zeroLevel = 128
        return (val + zeroLevel)
    }

    printResult() {
		console.log("Lösung:");
		for (let i = 0; i < m.length; i++) {
			for (let j = 0; j < m[i].length; j++) {
				console.log("%6.2f", m[i][j]);
			}
			console.log();
		}
		console.log("Zusammensetzung der Basisbilder aus den Eingangsbildern:");
		for (let i = 0; i < mInv.length; i++) {
			var sum = 0;
			for (let j = 0; j < mInv[i].length; j++) {
				let val = mInv[i][j];
				console.log("%6.2f ", val);
				sum += val;
			}
			console.log("  --> %6.2f\n", sum);
		}
		console.log();
	}
}
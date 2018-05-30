/**
 * Calculates the target / basis images and the user matrix.
 * Instances:  Level.java, Images.java
 * */

import java.awt.image.BufferedImage;
import java.util.Arrays;
import java.util.Random;

public class GameEngine {

	private Level level;
	private int levelNumber;
	
	private int targetPixels[][];
	private BufferedImage[] targetImages;
	private double[][][] basisPixels3; // Speicher für Basisbilder [Bildnummer][Position][Kanal]
	private BufferedImage[] basisImages;
	private int[][] userImagesPixels;
	private Random rand = new Random(1112);

	private int numPics;
	private int numOnes; // 0 < numOnes < numPics
	private boolean doGenerate;
				// true: generiere Basisbilder, die die gelesenen Eingangsbilder erzeugen
				// false: verwende die Bilder als Basisbilder und erzeuge Kombinatioen
	private double maxWeight = 1; // 0.51, 0.71.. 2.01
								  // wie stark darf ein Bild in der Linearkombination verwendet werden
	private int width, height;
	private double[][] m;    // richtige Kombination der Basisbilder (0/1) 
	private double[][] mInv; // Kombination der Eingangsbilder zur Erzeugung der Basisbilder
	private double [][] wUser; // Kombination des Nutzers
	private int[] correctUserCombinations; // stores how many combinations the user got right (each row), 1 = right, 0 = wrong

	
	public GameEngine(int levelNumber) {
		this.levelNumber = levelNumber;
		loadLevel();
		
		this.wUser = new double[numPics][numPics]; // matrix der userwauswahl 
		this.userImagesPixels = new int[numPics][width*height]; // kombinierte pixel der userauswahl
		this.correctUserCombinations = new int[numPics]; // 1 wenn richtige kombination, 0 wenn falsch
		
		targetImages = new BufferedImage[numPics];
		basisImages = new BufferedImage[numPics];
		
		getTargetAndBasisImages();
	}
	
	public void loadLevel(){
		// load the settings for a specific level
		this.level = new Level(levelNumber);
		this.numPics = level.getNumPics();
		this.numOnes = level.getNumOnes();
		this.doGenerate = level.getDoGenerate();
	}
	
	public void setLevel(int newLevel){
		this.levelNumber = newLevel;
	}
	
	public int returnScore(int clicks){
		int score = 0;
		int maximum = level.getClickMaximum();
		int optimum = level.getClickOptimum();
		
		if(score == optimum){
			score = 100;
		} else if(score >= maximum){
			score = 0;
		}
		
		return score;
	}
	
	public BufferedImage calculateUserImage(double[] wUserRow, int index){	
		// berechnet das Ergebnisbild basierend auf der Matrixauswahl des Users (jede Reihe einzelnd)
		int[] pixelsBlended = blend3DDoubleToPixels(basisPixels3, wUserRow);
		BufferedImage userImage =  new BufferedImage(width, height, BufferedImage.TYPE_INT_ARGB);
		userImage.setRGB(0, 0, width, height, pixelsBlended, 0, width);
		userImagesPixels[index] = pixelsBlended;
		return userImage;
	}
	
	public boolean comparePictures(int index, double [] wUserRow){
		// compare the combination by the user with the target image
		// compare the solution matrix m with what the user clicked wUserRow
		// int index is one specific row in the matrix
		boolean equals = false;
		for(int i = 0; i < numPics; i++){
			if(wUserRow[i] == m[index][i]){
				equals = true;
			} else{
				return false;
			}
		}
		return equals;
	}
	
	public int getAmountOfCorrectCombinations() {
		// count how many combinations the user has right at the same time
		// if correctCombinations == numPics -> finished, switch to next level
		int correctCombinations = 0;
		for(int i = 0; i < correctUserCombinations.length; i++){
			if(correctUserCombinations[i] > 0){
				correctCombinations++;
			}
		}
		return correctCombinations;
	}

	public void setCorrectCombination(int index, boolean value) {
		// set the combinations by the user (per row)
		if(value == true){
			correctUserCombinations[index] = 1;
		} else{
			correctUserCombinations[index] = 0;
		}
	}
	
	public double getUserMatrixValue(int row, int col){
		return this.wUser[row][col];
	}
	
	public void setUserMatrix(int row, int col, int value){
		this.wUser[row][col] = value;
	}
	
	private void getTargetAndBasisImages(){
		// lade die grundlegenden Bilder (aus dem pics Ordner oder mit dem generator)
		Images images = new Images();
		images.setNumImages(numPics); // generiere bilder mit returnGeneratedImages()

		// für die ersten 3 Level generierte Bilder nehmen, danach wieder die Images aus dem Ordner 
		
		if (doGenerate == true) { 	
			// generate basis from input images
			
			if(levelNumber < 3){
				targetImages = images.returnGeneratedImages(); // ImageGenerator Bilder
			} else{
				targetImages = images.returnImages(); // Bilder aus pics Ordner
			}
			targetPixels = images.returnTargetPixels();			

			this.width = targetImages[0].getWidth();
			this.height = targetImages[0].getHeight();	
		}
		else {	
			// read basis images
			
			if(levelNumber < 3){
				basisImages = images.returnGeneratedImages(); // ImageGenerator Bilder
			} else{
				basisImages = images.returnImages(); // Bilder aus pics Ordner
			}

			this.width = basisImages[0].getWidth();
			this.height = basisImages[0].getHeight();
		}
		
		calculateBasisAndTargetImages();
	}
	
	public void calculateBasisAndTargetImages() {
		if (doGenerate == true) { 	// generate basis from input images
			findCombinations();   // finde eine Konfiguration m mit Zeilensummen von mInv > 0 
			
			int[][] pixelsBasis = new int[numPics][];
			basisPixels3 = new double[numPics][][];
			basisImages = new BufferedImage[numPics];    // Basisbilder zum Anzeigen

			for (int i = 0; i < numPics; i++) {
				basisPixels3[i] = blendPixelsTo3DDoubleImage(targetPixels, mInv[i]);
				pixelsBasis[i]  = blendPixelsToPixels(targetPixels, mInv[i]);
				basisImages[i] = new BufferedImage(width, height, BufferedImage.TYPE_INT_ARGB);
				basisImages[i].setRGB(0, 0, width, height, pixelsBasis[i], 0, width);
			}
		}
		else {	
			mInv = new double[numPics][numPics];
			int[][] pixelsBasis = new int[numPics][width*height];
			for (int i = 0; i < numPics; i++) {
				mInv[i][i] = 1; //1./numOnes;
				basisPixels3 = new double[numPics][][];
				basisImages[i].getRGB(0, 0, width, height, pixelsBasis[i], 0, width);
			}
			for (int i = 0; i < numPics; i++){
				basisPixels3[i] = blendPixelsTo3DDoubleImage(pixelsBasis, mInv[i]);
			}
			

			generateRandomM();
			

			targetPixels = new int[numPics][width*height];
			

			for (int i = 0; i < targetPixels.length; i++) {
				targetPixels[i] = blend3DDoubleToPixels(basisPixels3, m[i]);
				targetImages[i] = new BufferedImage(width, height, BufferedImage.TYPE_INT_ARGB);
				targetImages[i].setRGB(0, 0, width, height, targetPixels[i], 0, width);
			}
		}
		printResult();
	}
	
	private void findCombinations() {
		boolean success;
		int tries = 0;
		do {
			generateRandomM();
			
			success = true;
			mInv = InverseMatrix.invert(m);
			for (int i = 0; i < mInv.length; i++) {
				for (int j = 0; j < mInv[i].length; j++) {
					double val = mInv[i][j];
					if (Double.isInfinite(val) || Double.isNaN(val)) 
						success = false; // wenn Rang zu klein ist
					else if (Math.abs(val) > maxWeight) // kein Bild stärker als mit maxContribution gewichten
						success = false;
				}
			}
		} while (!success && tries++ < 10000);
		
		if (!success) {
			System.out.println("Impossible Settings, aborting");
			System.exit(-1);
		}
	}
	
	
	// InverseMatrix in Matrix Klasse ändern?
	private void generateRandomM() {
		boolean success;		
		do {
			// numOnes mal eine 1 in jede Zeile von m setzen	
			m = new double[numPics][numPics];
			for (int i = 0; i < m.length; i++) {
				for (int j = 0; j < numOnes; j++) {
					int index;
					do {
						index = rand.nextInt(numPics);
					}
					while (m[i][index] == 1);
					m[i][index] = 1;
				}
			}		
			success = true;
			for (int i = 0; i < numPics; i++) {
				for (int j = i+1; j <numPics; j++)  {
					boolean same = true; // identische Kombinationen/Zeilen vermeiden
					for (int k = 0; k <numPics; k++) 
						if (m[i][k] != m[j][k])
							same = false;
					if (same) {
						success = false;
						break;
					}
				}
			}
		} while (!success);
		
//		for (int i = 0; i < m.length; i++) 
//			for (int j = 0; j < m.length; j++)
//				m[i][j] /= numOnes;
	}
	
	private int[] blendPixelsToPixels(int[][] pixelsIn, double[] w) {
		// w[i] sind gewichte - nehme ich das Bild (ja oder nein?)
		// fi damit verschiebt man die Werte zum Zerolevel (-128)
		int[] pixels = new int[pixelsIn[0].length];

		for (int i = 0; i < pixels.length; i++) {
			double r = 0, g = 0, b = 0;

			for (int j = 0; j < pixelsIn.length; j++) {
				int cj = pixelsIn[j][i];
				double rj = f((cj >> 16) & 255);
				double gj = f((cj >>  8) & 255);
				double bj = f((cj      ) & 255);

				r += w[j]*rj;
				g += w[j]*gj;
				b += w[j]*bj;
			}

//			r = (r - 128) / numOnes + 128;
//			g = (g - 128) / numOnes + 128;
//			b = (b - 128) / numOnes + 128;
			
			// begrenzung zwischen 0 und 255
			r = Math.min(Math.max(0, fi(r)), 255);
			g = Math.min(Math.max(0, fi(g)), 255);
			b = Math.min(Math.max(0, fi(b)), 255);
			pixels[i] = 0xFF000000 | ((int)r <<16) | ((int)g << 8) | (int)b;
		}
		return pixels;
	}
	
	private double[][] blendPixelsTo3DDoubleImage(int[][] pixelsIn, double[] w) {
		double[][] pixels = new double[pixelsIn[0].length][3];

		for (int i = 0; i < pixels.length; i++) {
			double r = 0, g = 0, b = 0;

			for (int j = 0; j < pixelsIn.length; j++) {
				int cj = pixelsIn[j][i];
				double rj = f((cj >> 16) & 255);
				double gj = f((cj >>  8) & 255);
				double bj = f((cj      ) & 255);	

				r += w[j]*rj;
				g += w[j]*gj;
				b += w[j]*bj;
			}
			
			pixels[i][0] = fi(r);
			pixels[i][1] = fi(g);
			pixels[i][2] = fi(b);
		}
		return pixels;
	}
	
	private int[] blend3DDoubleToPixels(double[][][] pixelsIn, double[] w) {
		int[] pixels = new int[pixelsIn[0].length];

		double rMin = 0, rMax = 255;
		double gMin = 0, gMax = 255;
		double bMin = 0, bMax = 255;
		
		for (int i = 0; i < pixels.length; i++) {
			double r = 0, g = 0, b = 0;

			for (int j = 0; j < pixelsIn.length; j++) {
				double rj = f( pixelsIn[j][i][0]);
				double gj = f( pixelsIn[j][i][1]);
				double bj = f( pixelsIn[j][i][2]);	

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
		
		double max = Math.max(rMax, Math.max(gMax,  bMax));
		double min = Math.min(rMin, Math.min(gMin,  bMin));
				
		System.out.println(rMin + "," + rMax + ", " + gMin + "," + gMax + ", " + bMin + "," + bMax );
		
		for (int i = 0; i < pixels.length; i++) {
			double r = 0, g = 0, b = 0;

			for (int j = 0; j < pixelsIn.length; j++) {
				double rj = f( pixelsIn[j][i][0]);
				double gj = f( pixelsIn[j][i][1]);
				double bj = f( pixelsIn[j][i][2]);	

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
			
//			g = Math.min(Math.max(0, fi(g) ), 255);
//			b = Math.min(Math.max(0, fi(b) ), 255);
			pixels[i] = 0xFF000000 | ((int)r <<16) | ((int)g << 8) | (int)b;
		}
		
		return pixels;
	}
	
	public double f(double val) {
		int zeroLevel = 128;
		return  val - zeroLevel;
	}
	
	public double fi(double val) {
		int zeroLevel = 128;
		return  (val + zeroLevel);
	}
	
	public int getHeight(){
		return this.height;
	}
	
	public int getWidth(){
		return this.width;
	}
	
	public BufferedImage[] getTargetImages(){
		return this.targetImages;
	}
	
	public BufferedImage[] getBasisImages(){
		return this.basisImages;
	}
	
	private void printResult() {
		System.out.println("Lösung:");
		for (int i = 0; i < m.length; i++) {
			for (int j = 0; j < m[i].length; j++) {
				System.out.printf("%6.2f", m[i][j]);
			}
			System.out.println();
		}
		System.out.println();
		System.out.println("Zusammensetzung der Basisbilder aus den Eingangsbildern:");
		for (int i = 0; i < mInv.length; i++) {
			double sum = 0;
			for (int j = 0; j < mInv[i].length; j++) {
				double val = mInv[i][j];
				System.out.printf("%6.2f ", val);
				sum += val;
			}
			System.out.printf("  --> %6.2f\n", sum);
		}
		System.out.println();
	}

	public int getNumPics() {
		return this.numPics;
	}

	public int getNumOnes() {
		return this.numOnes;
	}

	public boolean getDoGenerate() {
		return this.doGenerate;
	}

	public int getLevel() {
		return this.levelNumber;
	}
}

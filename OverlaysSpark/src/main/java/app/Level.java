/**
 * Stores the parameters and settings for each level.
 */
public class Level {

    private int level;
    private int numPics;
    private int numOnes;
    private int time;
    private int clickOptimum;
    private int clickMaximum; // wie oft darf man höchstens klicken
    private int amountOfLevels = 10;
    private int[][] levelSettings = new int[amountOfLevels][]; // [welches Level][Array mit int Einstellungen]

    public Level(int level) {
        this.level = level;
        setSettings();
        printSettings();
    }

    public void setLevel(int level) {
        this.level = level;
    }

    public int getNumPics() {
        return this.numPics;
    }

    public int getNumOnes() {
        return this.numOnes;
    }

    public boolean getDoGenerate() {
        return true;
    }

    public int getTime() {
        return this.time;
    }

    public int getAmountOfLevels() {
        return this.amountOfLevels;
    }

    private void setSettings() {
		/* create and fill levelSettings Array
		Second Array paramters:
		[0]: numPics
		[1]: numOnes
		[2]: time
		[3]: clickMaximum
		{ numPics, numOnes, time, clickMaximum }
		*/
        // LEVEL ONE
        levelSettings[0] = new int[]{3, 2, 200};
        // LEVEL TWO
        levelSettings[1] = new int[]{3, 2, 150};
        // LEVEL THREE
        levelSettings[2] = new int[]{3, 2, 120};
        // LEVEL FOUR
        levelSettings[3] = new int[]{3, 2, 100};
        // LEVEL FIVE
        levelSettings[4] = new int[]{4, 2, 100};
        // LEVEL SIX
        levelSettings[5] = new int[]{4, 2, 100};
        // LEVEL SEVEN
        levelSettings[6] = new int[]{4, 3, 100};
        // LEVEL EIGHT
        levelSettings[7] = new int[]{5, 3, 100};
        // LEVEL NINE
        levelSettings[8] = new int[]{5, 3, 100};
        // LEVEL TEN
        levelSettings[9] = new int[]{5, 4, 100};

        // get parameters of current level
		/*
		if(level < 5){
			this.doGenerate = false;
		} else{
			this.doGenerate = true;
		}
		*/
        this.numPics = levelSettings[level][0];
        this.numOnes = levelSettings[level][1];
        this.time = levelSettings[level][2];
        
        calculateClicksForScore();
    }
    
    private void calculateClicksForScore(){
    	int maximum; // anzahl an maximal erlaubten clicks des users
    	int optimum; // schnellst mögliche bzw. optimale lösung 

    	maximum = ((int) Math.pow(2, numPics) - numOnes) * numPics;
    	optimum = numPics * numOnes;
    	
    	this.clickMaximum = maximum;
    	this.clickOptimum = optimum;
    }
    
    public int getClickMaximum() {
        return this.clickMaximum;
    }
    
    public int getClickOptimum() {
        return this.clickOptimum;
    }

    private void printSettings() {
        System.out.println("######################\nLevel Index: " + level + "\nNum Pics: " + levelSettings[level][0]
                + "\nNum Ones: " + levelSettings[level][1] + "\nTime: " + levelSettings[level][2] + "\nTotal amount of Levels: " + amountOfLevels + "\n######################");
    }
}

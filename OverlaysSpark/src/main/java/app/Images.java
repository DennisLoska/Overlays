import java.awt.image.BufferedImage;
import java.io.File;
import java.io.IOException;
import java.util.Random;

import javax.imageio.ImageIO;

/**
 * Loads the basic images / sets from the 'pics' folder.
 * Instances:  ImageGenerator.java
 */
public class Images {
    private String[] imageNames = {
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
    };

    private BufferedImage[] images;
    private int imageSet;
    private int numImages;
    private int width;
    private int height;

    public Images() {
        //returnImages(numImages);
        Random rand = new Random();
        this.imageSet = rand.nextInt(11);
    }

    public void setNumImages(int num) {
        this.numImages = num;
    }

    public BufferedImage[] returnImages() {
        this.images = new BufferedImage[numImages];
        try {
            for (int i = 0; i < numImages; i++)
                images[i] = ImageIO.read(new File("pics/" + imageNames[i + imageSet * 5]));
        } catch (IOException e) {
            e.printStackTrace();
        }
        this.width = images[0].getWidth();
        this.height = images[0].getHeight();
        return images;
    }

    public BufferedImage[] returnGeneratedImages() {
        this.images = new BufferedImage[numImages];

        for (int i = 0; i < numImages; i++)
            images[i] = new ImageGenerator().getRandomImage();
        this.width = images[0].getWidth();
        this.height = images[0].getHeight();
        return images;
    }

    public int[][] returnTargetPixels() {
        int targetPixels[][] = new int[numImages][width * height];
        // Lesen der Pixeldaten
        for (int i = 0; i < numImages; i++)
            images[i].getRGB(0, 0, width, height, targetPixels[i], 0, width);
        return targetPixels;
    }
}

import java.awt.image.BufferedImage;
import java.util.Random;

/**
 * Generates random picture sets (easy images for the first few levels).
 */
public class ImageGenerator {

	private int width = 150;
	private int height = 150;
	private BufferedImage randomImage = new BufferedImage(width, height, BufferedImage.TYPE_INT_ARGB);

	public ImageGenerator(){
		// create random colors
		Random rand = new Random();
		int r = rand.nextInt(256);
		int g = rand.nextInt(256);
		int b = rand.nextInt(256);

		int[] argb = new int[width * height];
		for(int i = 0; i < width * height; i++){
			argb[i] = 0xFF000000 | (r << 16) | (g << 8) | b;
		}
		randomImage.setRGB(0, 0, width, height, argb, 0, 0);
	}

	public BufferedImage getRandomImage() {
		return randomImage;
	}
}

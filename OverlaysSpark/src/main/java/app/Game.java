import javax.swing.JFrame;
import javax.swing.SwingUtilities;

/**
 * Creates display and starts game.
 * Instances: Display.java
 */
public class Game extends JFrame {

    private static final long serialVersionUID = 1L;

    public static void main(String[] args) {
        SwingUtilities.invokeLater(new Runnable() {
            public void run() {
                Game game = new Game();
                game.setVisible(true);
            }
        });
    }

    public Game() {
        setTitle("Image Overlay Game");
        setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);

        Display display = new Display();

        int numPics = display.getNumPics();
        int height = display.getHeight() + 150;
        int width = display.getWidth() + 150;

        add(display);
        setSize(numPics * width + 4 * 4 * 30, numPics * height + 4 * 4 * 30);
    }
}
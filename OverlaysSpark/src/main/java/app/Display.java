/**
 * Displays the game (overview or a single level).
 * Instances: GameEngine.java
 */

import java.awt.BasicStroke;
import java.awt.Color;
import java.awt.Dimension;
import java.awt.Graphics;
import java.awt.Graphics2D;
import java.awt.event.KeyEvent;
import java.awt.event.KeyListener;
import java.awt.event.MouseEvent;
import java.awt.event.MouseListener;
import java.awt.image.BufferedImage;
import javax.swing.JPanel;

class Display extends JPanel implements MouseListener, KeyListener {

    private static final long serialVersionUID = 1L;

    private GameEngine calculator;
    private int levelNumber = 0;
    private int numPics;
    private int numOnes;
    private int width, height;
    private int clickCounter;

    public Display() {
        super();
        this.setFocusable(true);
        this.requestFocusInWindow();
        addMouseListener(this);
        addKeyListener(this);
        grabFocus();
        loadSettings();
    }

    public int getNumPics() {
        return this.numPics;
    }

    public void loadSettings() {
        // calculate the target / basis images to display them
        this.calculator = new GameEngine(levelNumber);

        this.width = calculator.getWidth();
        this.height = calculator.getHeight();

        this.numPics = calculator.getNumPics();
        this.numOnes = calculator.getNumOnes();

        repaint();
        //keyPressed(null); // shuffle images
    }

    private void doDrawing(Graphics g) {
        BufferedImage[] targetImages = calculator.getTargetImages();
        if (targetImages[0] == null){ return; }
        BufferedImage[] basisImages = calculator.getBasisImages();
        Graphics2D g2d = (Graphics2D) g;
        Dimension size = getSize();
        g2d.setColor(Color.WHITE);
        g2d.fillRect(0, 0, size.width, size.height);
        g2d.setStroke(new BasicStroke(5));
        int bx = 30, by = 30; // abstände zwischen bildern

        // MALE TARGET UND BASIS IMAGES
        for (int i = 0; i < numPics; i++) {
            g2d.drawImage(basisImages[i], null, bx + i * (width + bx), by); // horizontal
            g2d.drawImage(targetImages[i], null, bx + width + numPics * (width + bx), (height + by) + i * (height + by)); // vertikal, ganz rechts
        }

        // MALE SQAURE MATRIX (USER MATRIX)
        for (int row = 0; row < numPics; row++) {
            for (int col = 0; col < numPics; col++) {
                if (calculator.getUserMatrixValue(col, row) > 0) { // prüft ob feld vom user ausgewählt ist
                    // draw the matrix if square picked
                    g2d.setColor(Color.BLACK);
                    g2d.drawRect(bx + (row) * (width + bx), (col + 1) * height + (col + 1) * by, width, height);
                    g2d.fillRect(bx + (row) * (width + bx), (col + 1) * height + (col + 1) * by, width, height);
                } else {
                    // draw the matrix if square not picked
                    g2d.setColor(Color.LIGHT_GRAY);
                    g2d.drawRect(bx + (row) * (width + bx), (col + 1) * height + (col + 1) * by, width, height);
                    g2d.fillRect(bx + (row) * (width + bx), (col + 1) * height + (col + 1) * by, width, height);
                }
            }
        }

        // MALE ERGEBNISBILD FÜR JEDE REIHE
        // Auswahl des Users für jede Reihe (vektor anstatt matrix)
        double[] wUserRow = new double[numPics];
        for (int row = 0; row < numPics; row++) {
            for (int col = 0; col < numPics; col++)
                wUserRow[col] = calculator.getUserMatrixValue(row, col);
          
            // schreibe für jede Reihe das Ergebnisbild
            BufferedImage imgBlended = calculator.calculateUserImage(wUserRow, row);
            g2d.drawImage(imgBlended, null, numPics * (width + bx), (row + 1) * (height + by));
           
            // setzt anzahl richtiger kombinationen auf 0 (false)
            calculator.setCorrectCombination(row, false);

            // UMRAHME ERGEBNISBILD ROT ODER GRÜN
            // zähle anzahl der geklickten bilder pro reihe
            int imagesClicked = 0;
            for (int index = 0; index < numPics; index++)
                if (wUserRow[index] > 0) imagesClicked++;

            // RICHTIG: GRÜN
            // prüft ob die werte der beiden matrizen (lösung und user auswahl) übereinstimmen
            boolean samePic = calculator.comparePictures(row, wUserRow);
            if (samePic && imagesClicked >= numOnes) {
                g2d.setColor(Color.GREEN);
                g2d.drawRect(numPics * (width + bx), (row + 1) * (height + by), width, height);

                // count the right combinations by the user to switch to next level
                calculator.setCorrectCombination(row, true); // true -> the right combination

                // prüfe ob in jeder reihe alle kombinationen richtig sind == level finished
                if (calculator.getAmountOfCorrectCombinations() == numPics) {
                	// berechne score
                    int score = calculator.returnScore(clickCounter);
                    System.out.println("Score: " + score);
                	
                    // load next level
                    levelNumber += 1;
                    clickCounter = 0;
                    loadSettings();
                }
            }
            // FALSCH: ROT
            if (!samePic && imagesClicked >= numOnes) {
                g2d.setColor(Color.RED);
                g2d.drawRect(numPics * (width + bx), (row + 1) * (height + by), width, height);
            }
        }
    }

    @Override
    public void mouseClicked(MouseEvent arg0) {
        // suche den richtigen index des Bildes raus, je nach höhe und breite der mausposition
        int deltaX = width + 30;
        int deltaY = height + 30;

        int row = arg0.getY() / deltaY - 1;
        int col = arg0.getX() / deltaX;

        if (calculator.getUserMatrixValue(row, col) > 0) {
            //wUser[row][col] = 0; // löschen
            calculator.setUserMatrix(row, col, 0);
            clickCounter++;
        } else {
            //wUser[row][col] = 1; // setzen
            calculator.setUserMatrix(row, col, 1);
            clickCounter++;
        }

        System.out.println("Click counter: " + clickCounter);
        repaint();
    }

    @Override
    public void paintComponent(Graphics g) {
        super.paintComponent(g);
        doDrawing(g);
    }

    @Override
    public void keyPressed(KeyEvent e) {
        System.out.println("Neue Kombination");
        calculator.calculateBasisAndTargetImages();
        //wUser = new double[numPics][numPics]; // lösche die user auswahl
        repaint();
    }

    @Override
    public void mouseEntered(MouseEvent arg0) {
    }

    @Override
    public void mouseExited(MouseEvent arg0) {
    }

    @Override
    public void mousePressed(MouseEvent arg0) {
    }

    @Override
    public void mouseReleased(MouseEvent arg0) {
    }

    @Override
    public void keyReleased(KeyEvent e) {
    }

    @Override
    public void keyTyped(KeyEvent e) {
    }
}

# Overlays

www.overlays.dennisloska.com

## Gruppe

Betreuer: 
Prof. Dr. Kai-Uwe Barthel 

Mitglieder:
Dennis Loska
Luisa Kurth

## Aufgabenstellung

Erstellung eines Spiels (browserbasiert oder als App) zum Trainieren der Wahrnehmung von Farbüberlagerungen. Das Spiel braucht eine gute Spielmechanik, ein Bewertungssystem und eine angemessene Steigerung des Schwierigkeitsgrads. Die Bildüberlagerung soll nachvollziehbar sein und es sollen gut geeignete Bilder (fotorealistisch oder selbst generiert) benutzt werden. 

## Zeit

Gesamtes Sommersemester 2018 (April bis Juli). 

## Zur Verfügung gestelltes Material

Das Spiel wurde auf Grundlage eines von Prof. Dr. Barthel geschriebenen Java Programms entwickelt. Dieses Programm beinhaltete die Matrixmultiplikationen zur Überlagerung der jeweiligen Basisbilder zu einem Zielbild, mitsamt der Generierung einer zufälligen binären Matrix (mit der Dimension von "numPics"x"numPics" und "numOnes" vielen 1 pro Zeile) und der dazugehörigen Inversen. 

## Umsetzung des Projektes

- Implementierung einer binären User-Matrix wUser, die bei jedem Klick aktualisiert wird und die vom User ausgewählten Basisbilder überlagert
- Implementierung eines Scores (50% Zeit und 50% Klickanzahl), einer Zeitangabe und eines Klickzählers
- Implementierung einer Validierung der Userauswahl (vergleiche User-Matrix mit Lösungsmatrix)
- Implementierung einer ImageGenerator Klasse, die zufällige Bilder mit verschiedenen Formen (Rechteck, Kreis oder Dreieck) mit zufälligen Positionen und Farben malt 
- Implementierung eines Seed Farb-Generators mit 3 Tests zur Auswahl von "optimalen" Farben zur Farbüberlagerung (testet Farben auf Abstand zueinander, testet Farben auf Abstand zu 128 / grau, testet Farben auf Grenzbereich nach der Überlagerung)
- Speicherung der getesteten und gut geeigneten Farben in Arrays, aus denen später zufällige Sets ausgewählt werden (Seed und Tests wurden danach rausgenommen)
- Optimierung der ImageGenerator Klasse durch flexible Anpassung an das jeweilige Level: Pro Level kann festgelegt werden, ob die generierten Bilder in Graustufen oder Farben gemalt werden sollen, ob sie eine ähnliche Position haben sollen und ob es ein "leeres" Feld geben soll, in dem keine Form und keine Farbe gemalt wird (einstellbar in der Level.js Klasse)
- Nutzung von fotorealistischen Bildern (Image.js Klasse) und selbst generierten Bildern (ImageGenerator.js Klasse) in Abhängigkeit des jeweiligen Levels (ebenfalls in Level.js)
- 

## Verwendete Technologien


## Klassen

Game.js

GameEngine.js

ImageGenerator.js

Images.js

InverseMatrix.js

Level.js

View.js

## Klassendiagramm


## Funktion des Spiels 


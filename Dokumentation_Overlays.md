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

Das Spiel zeigt dem User in jedem Level die zu überlagernden Basisbilder (oben, horizontal) und die zu erreichenden Zielbilder (ganz rechts, vertikal) an. Von jedem Basisbild geht ein Lichtstrahl aus, der vertikal nach unten leuchtet, solange man ihn nicht umleitet. In der Mitte befindet sich eine Matrix auf Glassteinen, die ihre Position verändern, wenn man sie anklickt und dadurch den vertikalen Lichtstrahl nach rechts im 90 Grad Winkel umleiten. Wenn ein Lichtstrahl umgeleitet wird, dann bewirkt das, dass das Basisbild, das den Strahl aussendet, rechts in der vertikalen Spalte neben den Zielbildern angezeigt wird. Wählt man mehrere Bilder in einer Reihe aus – also: werden mehrere Glassteine in einer Reihe gekippt und leiten die Strahlen um – dann werden diese Bilder nach den Regeln der additiven Farbmischung überlagert. Diese Bilder werden als User-Images bezeichnet (eins pro Zeile). Wenn ein User-Image in einer Zeile gleich dem Zielbild der selben Zeile ist, dann wurde eine korrekte Kombination gefunden und die Lampe auf der rechten Seite wird grün. Wenn alle Lampen grün leuchten, der Nutzer also alle Bilder richtig zu den vorgegebenen Zielbildern kombiniert hat, dann ist das Level geschafft. Es wird ein Score ausgegeben, der sich aus der benötigten Zeit (50%) und der benötigten Anzahl an Klicks (50%) errechnet, sowie eine Anzeige von 0-3 Sternen für das Level (die sich aus dem Score ergeben). 
Die Glassteine können beliebig oft angeklickt werden und die Reihenfolge der Auswahl der Basisbilder zur Überlagerung ist nicht wichtig / ausschlaggebend für das entstehende Bild. Ist die Zündschnur (= die dynamische Anzeige der zu verbleibenden Zeit / verbleibenden Klicks) unten im Bild abgelaufen, bevor der Nutzer alle Zeilen richtig kombiniert hat, ist das Level verloren. Diese verkürzt sich durch abgelaufene Zeit und mit jedem Klick auf einen Glasstein. 

## Erweiterungsmöglichkeiten 

- weitere Anpassungen und Optimierungen des Designs und zusätzliche Animationen (z.B. Explosion des Dynamits nach Ablaufen der Zeit, Rahmen um Bilder auch von Level zu Level verändern)
- Anbindung an API zur Verwendung eigener / anderer Bilder (Instagram, Flickr etc.)
- Anbindung einer Datenbank zur Speicherung des Punktestands (Score und Name des Users)
- Möglichkeit einzelne Level zu wiederholen und nicht immer von vorne anfangen zu müssen
- Level "freischalten" mit Punkten oder Sternen 
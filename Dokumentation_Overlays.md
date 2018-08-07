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

## Installation & Konfiguration

### Lokale Entwicklungsumgebung

Zunächst muss Node.js installiert werden. Es sollte hierfür die neuste _LTS_ Variante ab version **8.11.1** installiert werden (https://nodejs.org/en/). Nachdem Node installiert wurde sollte man in den _Projektordner_ Overlays gehen:

```
cd ./Overlays
```

Als nächstes muss in den _develop_ Branch gewechselt werden:

```
git checkout develop
```

Anschließend müssen die Dependencies, also abhängige Node-Module, welche benötigt werden installiert bzw. runtergeladen werden:

```
npm install
```

Nachdem die Dependencies erfolgreich installiert wurden, sollte man den lokalen Server starten können:

```
node index.js
```

Es sollte folgende Meldung im Terminal erscheinen:

```
Node app is running at localhost:5001
```

Wenn neue Features implementiert wurden, empfiehlt es sich pro Feature einen Commit zu machen und Änderungen erst zu pushen, wenn diese auch vollständig sind bzw. funktionieren. Dies wird mit folgendem Befehl realisiert:

```
git push origin develop
```

### Grunt - Taskrunner

Wenn das Repository geklont wurde, können wie oben beschrieben die Dependencies, wozu auch Grunt gehört, installiert werden.

```
npm install
```

Nachdem dies erfolgt ist, kann die Grunt CLI installiert werden, um die Grunt-Befehle ausführen zu können. Damit die Bildkompressions-Task funktioniert, müssen zudem noch mit _--save dev_ zwei spezielle Dependencies für die imagemin Task installiert werden. Das alles kann mit den folgenden befehlen realisiert werden:

```
npm install -g grunt-cli
npm install --save-dev grunt-contrib-imagemin
npm install --save-dev imagemin-mozjpeg
npm install grunt 
```

Falls als OS **Linux** verwendet wird, muss noch libpng16 installiert werden, wenn es im besagten OS nicht bereits schon installiert wurde, damit die Bildkompression funktioniert:

```
sudo apt-get install libpng16-16 //if you don't have it
sudo ldconfig
```

Jetzt kann getestet werden, ob Grunt erfolgreich installiert wurde, indem der Befehl **grunt** in ./Overlays ausgeführt wird.

```
grunt
```

Um das komplette Projekt einschließlich von komprimierten Bildern zu bauen muss folgende Task ausgeführt werden:

```
grunt build
```

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

- Node.js
- Bootstrap
- SASS
- jQuery
- Canvas-API
- Grunt

## Klassen

Game.js

GameEngine.js

ImageGenerator.js

Images.js

InverseMatrix.js

Level.js

View.js (keine Klasse an sich, sondern Sammlung von GUI-Funktionen)

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
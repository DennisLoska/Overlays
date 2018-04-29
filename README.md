# Overlays

www.overlays.dennisloska.com

## Wichtig für den Develop und Production Branch:

In den beiden Branches _develop_ und _production_ wird **nur** das finale Projekt bearbeitet - es entfällt also komplett der Java Teil! In diesen beiden Branches geht es ausschließlich um die Webseite Obverlays und die dazu in Javascript programmierte Version vdes Spiels.

Im Branch _develop_ wird entwickelt, und sobald ein neues Feature bzw. eine Aufgabe abgeschlossen ist, wird der _develop_ Branch in den _production_ branch gemerged (Dieses kann ich @Dennis machen - Ich werde mich Anhand der **Trello-Karten** orientieren, ob ein Task erledigt ist und somit der Branch mergebar).

## Ziele und wie es sein sollte

Ziel ist es, dass der production Branch **zu jeder Zeit** online ist und immer funktioniert. Was wir auf der IMI-Showtime präsentrieren, wird letztenendes der _production_ Branch sein. Dieser kann auf meinem Server laufen, aber wenn wir Node.js lokal installiert haben, können wir auch ohne Probleme eine lokale Version der Seite laufen lassen, damit es bei der Präsentation keine Probleme gibt!

## Lokale Entwicklungsumgebung (mini Tutorial)

Du solltest Node.js auf deinem Rechner installiert haben. Auf dem Server läuft Versionb _8.9.4_, aber auf der lokalen Umgebung sollte die neuste LTS Variante ab version **8.11.1** installiert werden. Nachdem Node installiert wurde solltest du am Besten das Repository klonen und dann im Terminal da reingehen

```
cd ./Overlays
```

Anschließend müssen die Dependencies, also abhängige Node-Module die wir benötigen installiert bzw. runtergeladen werden. Hierfür nutzt du folgenden Befehl:

```
npm install
```

Jetzt sollte alles startklar sein und du solltest den lokalen Server starten können:

```
node index.js
```

Es sollte folgende Meldung im Terminal erscheinen:

```
Node app is running at localhost:5000
```

## Optimering Laboration 2
#### aa223ap

#### 1. Implementera CDN
Filer som inte är specifika för appen har hämtats från CDN. Detta kan försämra för de som sitter väldigt nära den egna servern, men leder generellt till en prestandaförbättring.

Dessa filer hämtas från Mozillas CDN [JSDelivr](http://www.jsdelivr.com/)
* bootstrap.min.css i index
* bootstrap.min.js i index

#### 2. Ta bort duplikationer av filer
Samma skript länkas in på massor av ställen. Dessa duplikationer har tagits bort:

* jquery i mess
* bootstrap i mess (duplicerad - kanske kan skippas då den cachas på sidan innan)

#### 3. Ta bort överflödiga filer
Massor av onödiga GETs görs. Följande filer bör tas bort för att de inte fyller något syfte:

* script.js i mess (blank fil)
* background=background="http://www.lockley.net/backgds/big_leo_minor.jpg" på body-elementet i mess

#### 4. Endast minifierade filer bör länkas in
Bootstraps CSS och JS, jQuery och MessageBoard och Message bör endast länkas in minifierade.

* byt bootstrap.css till bootstrap.min.css
* byt bootstrap.js till bootstrap.min.js
* byt jquery.js till jquery.min.js
* minifiera Message
* minifiera MessageBoard
* minifiera inline CSS

#### 5. CSS i header, JS i slutet av body
Flytta ner alla skript till slutet av body. Se till att all CSS som inte är above the fold länkas in i filer i HEAD.

#### 6. Minifiera inline CSS
All CSS som är inline ska minifieras och tomma element ska tas bort.

#### 7. Minifiera HTML
HTMLen bör minifieras.

#### 8. Skippa jQuery
[You might not need jQuery.](http://youmightnotneedjquery.com/) jQuery används väldigt sparsamt, det vore bra att skippa den. 

#### 9. Skippa inline JS längst ner i body. 
Kör istället init direkt från skriptet. Om den länkas in längst ner i body kommer window.onload att vara klar.

#### 10. Konkatera skript
Alla skript som inte är via CDN bör konkateneras. MessageBoard och Message bör konkateneras, samtidigt som de minifieras.

#### 11. Ta bort onödiga filer i filträd
Ta bort filer som aldrig används. 
* index.html
* css/dyn.css
* pic/b.jpg

#### 12. Slå ihop alla bilder till en sprite
Bilder bör slås ihop till en enda sprite, för att minska GET.
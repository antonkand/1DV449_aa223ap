# Reflektion Laboration 1
aa223ap@student.lnu.se

### Vad tror Du vi har för skäl till att spara det skrapade datat i JSON-format?
Att spara datat i JSON gör det lätt att använda. Det går att spara lokalt, att göra publikt tillgängligt, göra AJAX-anrop på den skrapade datan och om man även ser till dokumentorienterade-databaser är det i princip bara att skjuta in datat direkt till DB. Att putta in JSON i t ex MongoDB är rakt på sak.

Formatet är även lätt att läsa för människor, om vettiga key-valuepairs används. Exempel:

```json
{
    "courses": [
        { "name": "kursnamn1", "url": "http://kurs1.se" },
        { "name": "kursnamn2", "url": "http://kurs2.se" },
        { "name": "kursnamn3", "url": "http://kurs3.se" }
    ]
} 
```

Den skrapade datan går också att använda som en cachad resurs, vilket sparar många serveranrop. 

###Olika jämförelsesiter är flitiga användare av webbskrapor. Kan du komma på fler typer av tillämplingar där webbskrapor förekommer?
Sidor som är ämnescentrerade, exempelvis sportsidor för ett visst lag eller fansidor för kändisar, kan skrapa flera sidor för att generera material. De mer oetiska så kallade "content farms" skrapar andra sidor, ofta för egen vinning utan tillstånd. Informationstunga sidor i allmänhet samlar in mycket data automatiskt (även om det då kanske främst handlar om API-anrop och inte ren skrapning).

###Hur har du i din skrapning underlättat för serverägaren?
Serverägaren har en json-resurs som kan loopas igenom, som inte kräver flera serveranrop eftersom det redan har hämtats en gång, och har fått en tydlig sammanställning av datan som önskades. 

###Vilka etiska aspekter bör man fundera kring vid webbskrapning?
Den viktigaste aspekten bör vara: __varför skrapa?__
Skrapas det för att underlätta, med tillstånd, kan det vara ett effektivt sätt samla in information om de tekniska spärrarna finns på plats för att inte bombardera servern med anrop. 

En stor etisk frågeställning är också; hur förhåller sig skrapning till upphovsrätt? 

Om en upphovsrättshavare skriver en artikel som tagit många timmars arbete, 
hur förhåller sig skrapan till att vidaredistribuera andras material? Det är väldigt lätt att på ett oetiskt sätt dela vidare andra människors arbete utan att ge något tillbaka. 

###Vad finns det för risker med applikationer som innefattar automatisk skrapning av webbsidor? Nämn minst ett par stycken!
Utan någon speciell rangordning:
* Servern bombarderas med anrop
* Information som inte är menad att spridas distribueras vidare (exempelvis genom att logga in en skrapa och sedan skrapa informationen som inloggad)
* Serverägarens material sprids vind för våg utan tillstånd
* Serverägarens SERP på Google försämras om materialet inte längre är unikt
* Material förvanskas i samband med contentgenerering av blackhats (skrapa in massa data, snurra ihop paragrafer och namn mellan flera olika contentskrapningar)

###Tänk dig att du skulle skrapa en sida gjord i ASP.NET WebForms. Vad för extra problem skulle man kunna få då?
ASP.NET WebForms sätt att generera HTML utifrån användarens User-Agent skulle leda till att den genererade HTMLen kan renderas olika. Exempelvis kan en sorts HTML genereras då jag som skrap-programmerare läser igenom DOM-trädet via inspector och en annan för skrapan när den sedan ska skrapa. Att WebForms även skickar med ViewState, för att underlätta för utvecklaren, gör att skrapan också måste hantera korrekt ViewState för att kunna leverera ett pålitligt resultat.

###Välj ut två punkter kring din kod du tycker är värd att diskutera vid redovisningen. Det kan röra val du gjort, tekniska lösningar eller lösningar du inte är riktigt nöjd med.
Jag valde att använda mig av [Node.js](https://nodejs.org), som använder sig av asynkrona anrop. Läsningen av DOM är asynkron, men jag upptäckte att det var svårt att skriva filen asynkront då jag nästlar loopar. Detta ledde till synkron skrivning, vilket gjorde att jag valde att endast skriva efter 45 sekunder (för att vara säker på att datan hade skrapats). Asynkron programmering har många fördelar, men kan lätt bli mycket mer komplex pga så kallat "callback hell". Hade jag fått börja om - och inte haft VAB-dagar under perioden - hade jag löst det genom att använda modulen `async`. Ett annat område jag hade valt att fördjupa mig inom om jag haft mer tid hade varit [FRP](http://en.wikipedia.org/wiki/Functional_reactive_programming), då med ramverket [RxJS](https://github.com/Reactive-Extensions/RxJS). [RxJS](https://github.com/Reactive-Extensions/RxJS) hanterar asynkrona flöden på ett sätt som liknar synkron programmering - något att ta till sig och lära sig inför kommande labbar.

Av koden som skrevs för laborationen är jag mest nöjd med arkitekturen på min server (en entry point, app.js, som bryter ner skrapan till flera överskådliga moduler), samt hur jag presenterar data för användaren. Från den JSON som skrapas renderar jag upp en sida med [Jade](http://jade-lang.com/) och [Bootstrap](http://getbootstrap.com/). 

###Hitta ett rättsfall som handlar om webbskrapning. Redogör kort för detta.
[Aaron Swartz](http://sv.wikipedia.org/wiki/Aaron_Swartz), skapare av RSS, Creative Commons och medgrundare av Reddit, åtalades av den amerikanska staten för att ha skrapat miljontals dokument från MITs forskningsarkiv JSTOR. Pressen från åtalet ledde slutligen till att Aaron begick självmord. 

Åklagarna ansåg att Aaron skulle ha skrapat dokumenten för egen vinning medan försvaret ansåg att inget brott kunde påvisas då ingen information hade spridits vidare. Hård kritik lyftes mot MITs passivitet, mot åklagarens driv för fällande dom trots brist på bevis och mot hanteringen av rättsfallet.  

Dokumentären Internets Underbarn går igenom fallet och Aarons påverkan av IT-världen. Stora profiler som Tim Berners-Lee uttrycker öppet sin sorg över Aarons bortgång.

<small>Referens: SVTPlays dokumentär [Internets underbarn](http://www.svt.se/dox/internets-underbarn).</small>

###Känner du att du lärt dig något av denna uppgift?
Jag tycker det har gett en insikt i hur lätt det faktiskt är att "sno" material från andra. 

Tidigare har jag bara lekt lite med skrapning när jag kodat egna CLI-verktyg och då inte skrivit till fil utan bara gjort anrop. Jag var bekväm med att koda Node sen tidigare så det gav mig också glädjen i att få prova lite nya moduler. Uppgifter med fria teknikval är personliga favoriter då utforska tekniklandskapet är bland det roligaste jag vet inom webbteknik.
# Reflektion Laboration 3
aa223ap@student.lnu.se

## Vad finns det för krav du måste anpassa dig efter i de olika API:erna?

SR har ett öppet API utan restriktioner. Google är snudd på öppet, utan behov att registrera.
Vid mer än 25000 förfrågningar per dag vill Google ha betalt.

## Hur och hur länge cachar du ditt data för att slippa anropa API:erna i onödan?

Datan anropas via en proxyserver skriven i Node, som sparar datan i MongoDB.
Vid varje anrop kontrolleras datan om den är äldre än 2 minuter, om den är det gör servern ett nytt anrop till SR.
All cachekontroll sker på servern.

## Vad finns det för risker med din applikation?

Bryta mot API-regulationer om de ändras. Applikationen slutar fungera om Google Maps API inte svarar.

## Hur har du tänkt kring säkerheten i din applikation?

Då servern inte tar någon direkt input, skyddas inte sidan mot XSS eller CSRF. Om SR skulle returnera scripttaggar i sin JSON, skulle de kunna hamna i databasen. Inget skulle dock exekveras.
Applikationen skjuter även in en HTML-sträng som InfoWindows innehåll, men denna sätts på klienten. Skulle en attack ske där denna sida ändrades skulle kod kunna exekvera vid öppning av InfoWindows.
Ingen känslig data hanteras, vilket skulle göra Man In The Middle eller liknande onödiga / värdelösa. Om SRs API kapas, skulle elak kod kunna skjutas in till alla sidor som nyttjar APIet.

## Hur har du tänkt kring optimeringen i din applikation?

Jag har optimerat det som har varit inom min kontroll i förhållande till laborationens tidsram:

* Bootstraps CSS och JS hämtas via rekommenderad CDN
(med mer tid hade denna kunnat skrivits custom för att inte använda onödiga CSS-selektorer)
* jQuery hämtas via rekommenderad CDN
(hämtas eftersom att Bootstraps JS inte fungerar utan den)
* CSS är placerad i `<HEAD>`
* Med undantag för Google Maps APIs JS, är JS placerad i `<BODY>`
* Egenskriven JS är bundlad och uglifierad till en enda fil
* Endast [en enda GET](https://github.com/antonkand/1DV449_aa223ap/blob/es6/lab3/traffic-report/frontend/src/js/vanilla/trafficreportES6.js#L202) görs mot den egna servern för markers
* Servern [servar antingen cache-version eller helt ny version](https://github.com/antonkand/1DV449_aa223ap/blob/es6/lab3/traffic-report/api/controllers/TrafficController.js#L13-L25) beroende på om datan är mer än två minuter gammal
* Servern [strömmar ut datan så att den inte behöver vänta på ett helt anrop](https://github.com/antonkand/1DV449_aa223ap/blob/es6/lab3/traffic-report/api/services/TrafficService.js#L16-L44)

Bootstrap och jQuery är antagligen redan cachade sedan tidigare, eftersom de är använda väldigt brett.
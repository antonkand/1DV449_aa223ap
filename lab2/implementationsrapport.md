# Säkerhetshål, lösningar laboration 2
#### aa223ap@student.lnu.se

## Säkerhet

#### SQL injection:
Min implementation av chatprogrammet tillåter inte SQL injection, främst eftersom att det är en dokumentbaserad databas ([MongoDB](https://www.mongodb.org/)). Genom att använda ramverket Mongoose sker också en servervalidering av datan innan den sparas, med fälten specificerade som typ. 

#### Sessionsstöld:
Sessioner kan inte kapas på samma sätt som tidigare. En säker inloggningsmodul som använder sig av en proper sessionshanterare har implementerats.

#### Tillgång till messageboard via URL (utan att vara inloggad):
Routingen kontrollerar om användaren har loggat in när en `GET` utförs på `/messageboard`. Om användaren inte är inloggad så sker en redirect tillbaka till `/login`.

#### Sanering av inputdata (XSS-skydd):
Servern använder modulen [`sanitizer`](https://github.com/theSmaw/Caja-HTML-Sanitizer) för att sanera bort farliga taggar och attribut. 

#### Logga in utan att ha skapat användare: 
Inloggningen kräver registrerad användare och även att användarnamn och lösenord matchar. 

#### Skriva meddelanden utan användarnamn:
MessageBoard tillåter inte längre att skriva in andra användarnamn än det som registrerats (en e-postadress, användarnamn skulle kunna implementeras vid registrering).

#### Lagring av användarnamn och lösenord i databasen:
Vid registrering lagras lösenord som hashar, skapade med [`bcrypt`](https://www.npmjs.org/package/bcrypt-nodejs). Inga lösenord hittas i databasen och ingenting går att dekryptera. 

#### Säkerhetshål som inte har täckts upp:
Implementationen är fortfarande öppen för CSRF-attacker om användaren har sidan öppen på `/messageboard`. 

För att lösa CSRF-hålet implementerades modulen 
[`csurf`](https://www.npmjs.org/package/csurf). Detta fungerade bra vid `/signup` och `/login`, då de endast gör en `GET`. När användaren loggat in på MessageBoard och skrivit mer än en gång, kastade `csurf` korrekt ett undantag då dess token blivit ogiltig, eftersom att sidan inte refreshat och fått en ny token. Hur detta ska lösas i kombination med AJAX vet jag inte och hann inte med att ta reda på. Jag är medveten om att detta hål kvarstår.

## Optimering

#### CDN.
Min implementation använder sig av CSS för Bootstrap och Font Aweseome, som hämtas via Bootstraps eget CDN (`//netdna.bootstrapcdn.com/bootstrap/3.0.2/css/bootstrap.min.css` och `//netdna.bootstrapcdn.com/font-awesome/4.0.3/css/font-awesome.min.css`).

#### Placering av resurser.
CSS-filerna är placerade i `HEAD`, JS-filerna längst ner i `BODY`.

#### Minifiering av resurser.
Alla mina resurser är minifierade. De filer som hämtas från CDN använder sig av min-versioner och min egen kod är konkatenerad och minifierad för att minska `GET`.

#### Inga skräpfiler.
Inga skräpfiler länkas in.

#### Ingen duplikation.
Ingen sida innehåller duplikation av kod.

#### Minifierad inline.
CSS som hittas inline har minifierats.

#### Hejdå jQuery.
jQuery har tagits bort eftersom dess implementation var så liten.

#### Ingen inline JS.
Ingen inline JavaScript hittas i dokumenten.

#### Filträdet innehåller mestadels distribuerbara filer.
Onödiga filer har rensats bort.

#### Ikoner används istället för bilder.
Ikoner från Font Awesome används istället för bilder.

#### Gzippat content.
Allt innehåll skickas zippat.

#### Ytterligare prestandaoptimering som skulle kunna utföras.
Font Awesome skulle kunna minskas till att bara innehålla de ikoner jag använder. HTMLen skulle kunna minifieras.

## AJAX, XHR Stream, SSE
Implementationen av SSE och XHR-stream är haltande. På klientsidan är allting i sin ordning - SSE är implementerat med en fallback till XHR-stream. XHR-streamen fungerar korrekt och SSE likaså. 

Problemet är implementation från serversidan. Jag har lagt (många) timmar på att hitta hur en XHR-stream ska sättas upp korrekt från servern, men inte kunnat hitta en bra lösning. I samtal med John har jag börjat titta mer på `res.write` och hur dessa löser streamingen. XHR-stream är tydligen väldigt osexigt att skriva om på Node-bloggar och forum, då [Socket.io](https://socket.io) i princip är praxis att använda. Detta har gjort till att jag inte har åstadkommit en bra lösning på hur AJAXen ska fortsätta strömma - nu har jag en slags polling-variant som plockar hela arrayen.

Med SSE har jag även fått problem med att den är i princip odokumenterad. Jag vill skicka ett nytt event när ny data har kommit in, men detta finns inte dokumenterat mer än att man ska använda `sse.send(content)`. När jag skickar med mitt meddelande med `sse.send` skickas ingenting till klienten.

Jag har förståelse för hur det bör fungera, men har inte hunnit sätta mig och läsa SSE-modulens källkod eller hittat en bra implementation för hur serversidans ström ska skapas. (Samtal pågår med John!). 

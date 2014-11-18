# Säkerhetshål laboration 2
#### aa223ap@student.lnu.se
#### 1. **Fel:** Formuläret validerar inte inputen, tecken som `<>` tillåts och man får fylla i html-taggar. 

_Lösning_: Validering av input sker på både klient och serversidan inputen med modulen [`sanitizer`](https://github.com/theSmaw/Caja-HTML-Sanitizer). Strängar som saneras får en escape inför varje specialtecken.

#### 2. Inloggningen är felaktigt konstruerad, släpper igenom allt.

_Lösning:_ Kontrollera användarens identitet korrekt, se till att inte släppa igenom allt.

#### 3. **Fel:** SQL-injection hittas i formuläret. Det går att skjuta in t ex `fake' or '1=1';` som användare, med lösenord `fake' or '1=1';` för att bli inloggad.

_Lösning_: SQL har bytts ut till fördel för [MongoDB](https://www.mongodb.org/) med [Mongoose.js](http://mongoosejs.com/). Datan valideras som modeller för Mongoose, samt anropen är parameteriserade. 

#### 4. **Fel:** Routingen har ingen kontroll för access på /mess.php

_Lösning:_ Validering av GET på /login (min apps motsvarighet till /mess.php) sker.

#### 5. **Fel:** Formuläret har inget försvar mot CSRF

_Lösning:_ CSRF-tokens skjuts in i formuläret med hjälp av modulen `csurf`. 

#### 6. **Fel:** MessageBoard går att anropa direkt från JavaScript-konsolen. Script går att köra genom direkt från Chrome Dev Tools. För att exekvera egen kod kan detta exempel skrivas in i konsolen: `MessageBoard.evil = function () { console.log(document.cookie); }()`

_Lösning:_ MessageBoard renderas från serversidan, samt är inte en global variabel.

#### 7. **Fel:** MessageBoard exekverar script direkt från konsolen genom att skjuta in dem i DOM. Exempel, från konsolen: 
```javascript
var hack = new Message('text', new Date());
hack.getHTMLText = function () { 
	var body = document.querySelector('body'); 
	var script = document.createElement('script'); 
	script.innerHTML = 'alert("inserted")'; 
	body.appendChild(script); 
}
MessageBoard.messages.push(hack) // loggar 7
MessageBoard.renderMessage(6) // `hack` är id 6
// en alert med ordet "inserted" poppar upp
```

_Lösning:_ Ingen global MessageBoard, inte tillåta anrop från konsolen, inte låta getHTMLText() på Message skrivas över. Inte ha Message som global (dock irrelevant, genom att bara läsa MessageBoard kan man utläsa vad den förväntar sig och skapa ett nytt Message direkt från konsolen). Hade det här varit kopplat till en AJAX-lösning som pushar till server hade meddelandet kunnat skjutas in i databas.

#### 8. Script injection går att utföra på meddelanden genom att skjuta in en `<a href>`. Exempel på meddelande: `<a href="javascript:alert(document.cookie)">Injection</a>`

_Lösning:_ Tillåt inte andra protokoll än https eller http i länken. 

#### 9: MessageBoard är öppet för XSS. Användaren kan skriva in HTML rakt i inputen. 

_Lösning:_ Tillåt inte användaren att skicka in HTML-taggar, använd exempelvis Markdown eller sanera inputen innan den renderas.

#### 10: MessageBoard är inte CSRF-skyddad

_Lösning:_ Använd CSRF-tokens.

#### 11: MessageBoard accepterar `<a href=saknarfnuttar onclick=alert("inga fnuttar i hrefen")>Fnuttfri a href</a>`

_Lösning:_ Validera och sanera inputen.

#### 12: MessageBoard accepterar meddelanden utan användarnamn.

_Lösning:_ Acceptera inte inputen innan användaren har ett korrekt användarnamn (och - varför är inte användarnamnet detsamma som det man loggar in som?)

#### 13: Databasen lagrar användarnamn och lösenord i klartext.

_Lösning:_ Kombinera lösenordet med ett unikt salt, som sedan genererar en envägshash. Jämför lösenord+salt mot envägshashen vid inloggning.
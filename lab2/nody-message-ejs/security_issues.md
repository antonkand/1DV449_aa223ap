# Säkerhetshål laboration 2
#### aa223ap@student.lnu.se

Alla implementerade lösningar för dessa säkerhetshål har dokumenterats i filen [implementationsrapport.md](implementationsrapport.md)

#### 1. **Fel:** Formuläret validerar inte inputen, tecken som `<>` tillåts och man får fylla i html-taggar. 

#### 2. Fel: Inloggningen är felaktigt konstruerad, släpper igenom allt.

#### 3. **Fel:** SQL-injection hittas i formuläret. Det går att skjuta in t ex `fake' or '1=1';` som användare, med lösenord `fake' or '1=1';` för att bli inloggad.

#### 4. **Fel:** Routingen har ingen kontroll för access på /mess.php

#### 5. **Fel:** Formuläret har inget försvar mot CSRF

<del>#### 6. **Fel:** MessageBoard går att anropa direkt från JavaScript-konsolen. Script går att köra genom direkt från Chrome Dev Tools. För att exekvera egen kod kan detta exempel skrivas in i konsolen: `MessageBoard.evil = function () { console.log(document.cookie); }()`

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

_Lösning:_ Ingen global MessageBoard, inte tillåta anrop från konsolen, inte låta getHTMLText() på Message skrivas över. Inte ha Message som global (dock irrelevant, genom att bara läsa MessageBoard kan man utläsa vad den förväntar sig och skapa ett nytt Message direkt från konsolen). Hade det här varit kopplat till en AJAX-lösning som pushar till server hade meddelandet kunnat skjutas in i databas.</del>

#### Edit 27/11: Globaler är egentligen inte en säkerhetsfråga, utan mer en fråga om krockar med annat script och lösningarna här skulle inte ändra något. Skulle man binda MessageBoard i en IIFE skulle den anses vara privat (redan exekverad) och skulle (?) inte gå att exekvera från konsolen. Det som är problematiskt är ifall jag som anropar via konsolen ges åtkomst till metoder som postar saker, efter att jag har skrivit om metoder. På så vis kan jag kringgå olika skydd och skydden måste även implementeras på serversidan.

#### 8. Script injection går att utföra på meddelanden genom att skjuta in en `<a href>`. Exempel på meddelande: `<a href="javascript:alert(document.cookie)">Injection</a>`

#### 9: MessageBoard är öppet för XSS. Användaren kan skriva in HTML rakt i inputen. 

#### 10: MessageBoard är inte CSRF-skyddad

#### 11: MessageBoard accepterar `<a href=saknarfnuttar onclick=alert("inga fnuttar i hrefen")>Fnuttfri a href</a>`

#### 12: MessageBoard accepterar meddelanden utan användarnamn.

#### 13: Databasen lagrar användarnamn och lösenord i klartext.

#### 14: Sessioner kan kapas

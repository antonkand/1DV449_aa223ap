Informationen som ska skrapas är:

- [x] Kursens namn

- [x] Den URL kurswebbplatsen har

- [x] Kurskod

- [x] Den inledande texten om varje kurs

- [x] Senaste inläggets rubrik, författare samt datum/klockslag för detta inlägg (på formatet YYYY- MM- DD HH:MM)

- [x] Finns inte den aktuella informationen på något av fälten ska de ersättat med texten "no information". T.ex. "coursecode" : "no information".

- [x] Du ska också låta ditt skript ta reda på viss statistik kring skrapningen genom att att i ditt JSON- dokument inkludera även hur många kurser som skrapats ner samt en timestamp om när senaste skrapningen gjordes.

- [x] All data ska sparas på disk i en fil i korrekt JSON- format som man ska kunna komma åt via en URL efter skrapningen är gjord. 

- [x] Du ska bara skrapa kurser! Hitta ett enkelt sätt att särskilja dem!

- [x] Din webbskrapas alla HTTP- anrop mot coursepress webbserver ska identifiera dig på lämpligt sätt.

- [ ] URL till kursplanen

- [ ] Du ska implementera en enklare cachingsstategi som gör att om man 
anropar sidan som kör ditt script ska bara själva skrapningen göras ifall fem minuter har passerat sedan sista gången. 

- [ ] Du ska skriva ner dina reflektioner (se nedan) i ett dokument i md- format som ska vara enkelt åtkommligt från ditt GitHub- repo.

- [ ] När du anser dig klar med uppgiften gör du en release/tag på GitHub. Döp den liknande L01- v.1.0. Vid eventuella kompletteringar gör du en ny release L01- v.1.1 o.s.v.


# Dokumentasjon
# Idé
I denne oppgaven har jeg laget en dings som kan kobles opp med min utvalgte back-end som kan håndtere i teorien uendelig antall andre dingser. Jeg har også laget en enkel front-end hvor bruker kan logge inn, følge med på IoT dingsen sin og å kunne få den til å gjennomføre oppgaver. 

Løsningen er ment å kunne fungere fint for en plante, men den kan skaleres å brukes sammen med multippel planter også. Selve løsningen som er hos ende bruker er delt inn i to per i dag, grunnen til dette vil jeg komme tilbake til senere i denne dokumentasjon. Per nå så ser jeg på disse to delene som plante og potte. Plante delen er kun en passiv sensor som sender data til min back-end, mens potte er både passiv og aktiv i det at den sender data, samtidig som den også leser data fra skyen. 

## Oppkobling og fysisk løsning
I et første utkast av oppgaven benyttet jeg meg kun av en TTGO, ESP32 kort utdelt av foreleser. Dette kortet var koblet til både potte og plante, men jeg valgte å gå bort i fra denne løsningen på grunn av defekt sensor. 

### Defekt sensor
Jeg benyttet meg originalt av funduino sensor utdelt forrige semester i emnet Embeddedsystems. Dette fungerte greit i noen dager helt frem til lørdag 30 november. Da sluttet sensoren å fungere og jeg dro ned til skolen for å forstå hvorfor. Der fant jeg en sensor som ikke lenger hadde fullverdige striper. De hadde irret bort og forsvunnet til den grad at de nå var ubrukelige for oppgaven. Den rapporterte kontinuerlig at det var tomt for vann i beholderen slev om den var full. 

Så for å jobbe meg rundt dette problemet valgte jeg å bruke en annen semi defekt sensor. En HighGrow sensor som vi Orginalt skulle bruke for å løse denne eksamensoppgaven. Denne sensoren er defekt i det at den ikke gir konsistente data fra den innebygde temperatur og fukt sensoren sin. 

## Skytjeneste
Etter først å ha prøvd å bruke MQTT og Azure fant jeg ut at den løsningen som best dekket mine ønsker samt enklest kunne kombineres med allerede eksisterende kunnskaper jeg hadde så gikk jeg for Googles tjeneste Firebase. I Firebase kan man lett sette opp autoriseringer, database, back-end funksjoner samt hoste en nettside. Tjenesten er enkel å ta i bruk dersom man ønsker å lage mobile applikasjoner samt et web grensesnitt.

Det jeg ikke vist på forhånd, var at firebase også er et ekstremt enkelt og robust oppsett for IoT. Da spesifikt enkelt med alle kort av typen ESP da det finnes et enkelt bibliotek med navn `FirebaseESP32.h` som gjør det enkelt både å lese og skrive til database for en IoT dings. 

### Front -end
Jeg har nå i snart to år jobbet som React utvikler ved siden av studiene, jeg valgte derfor å sette opp et relativt enkelt oppsett hvor en person kan gå inn på [https://kirary-fad13.web.app][1] lage seg en bruker for så å skrive inn en seks tegn lang kode som gir bruker tilgang til en enkelt IoT dings. Nettsiden i seg selv er ikke veldig pen da jeg ikke er en grafisk designer, men jeg har skrevet det meste av SCSS koden selv som genererer utseendet. 

Nettsiden er for det meste bygget i moderne React som tar bruk av use effects og use state fremfor den tradisjonelle varianten av klasse komponenter. Det er også et par av disse i koden da jeg først bestemte meg bare for å kjapt sette opp en front-end, og de overlevde da jeg valgte å gjøre front-enden mer kompleks i en senere iterasjon. 

Den viktigste komponenten er `Home.jsx` dette er siden som linkes til som dashboard hvor bruker kan få oversikt over alle plantene de har. Planter vil ligge etter hverandre i en liste på denne siden. 

#### Hvis jeg hadde hatt mer tid
Personlig synes jeg det er gøy å lage front-end. Litt som å koble dingser så gir front-end utvikling en umiddelbar feed back. Planen var derfor å lage en enkel iOS og Android app også som ville tillatt bruker å motta varslinger på telefonen sin dersom visse endringer forekom for brukerene. Dessverre siden denne eksamen har gått parallelt med iOS eksamen så har jeg hver gang jeg har åpnet Xcode valgt å prioritere den andre eksamenen. Koden er allikevel klar på back-end til å støtte en iOS og Android implementasjon som er noe jeg kommer til å gjøre etter eksamensperioden da jeg kommer til å benytte meg av denne løsningen i hjemmet selv.

## Oppkobling
I oppgaven benyttes en rekke forskjellige sensorer. Under har jeg laget en liste over alle komponentene benyttet i oppgaven. Det er også et bilde i teksten av et Fritzing-skjema for å vise oppsettet jeg har laget. Skjemaet har riktignok noen feil da jeg ikke klarte å finne rette komponenter i Fritzing. Disse feilene er dokumentert i avsnittet _Feil i Frizing-skjemaet_. 

### Komponenter brukt
- Particle Proton
- Vannmålersensor
- LED-Lyspære
- Flammesensor
- LCD skjerm (16x2)
- Lyssensor
- Høyttaler
- 2x 10K resistorer
- 2x 220 resistorer 
- 4,7K resistor
- Temperaturmåler (DS18S20)


#### Forskjeller
1. Motstand skjerm i virkeligheten 10K og ikke 220 som på tegningen.
2. Temperatursensor i virkeligheten DS18S20 og ikke DS18B20 som på tegningen. 
3. Motstand til DS18S20 er 4,7K og ikke 220 som på tegningen
4. Jeg fant ikke flammesensor i lista. Derfor har jeg satt inn en stor LED-pæra i stedet. 
5. Kablene til skjermen er ikke festet, da vi har en driver loddet fast på baksiden. Jeg valgte å sette inn skjermen og la kablene markere koblingen til driveren.
6. Vannmåler var ikke å finne i lista over sensorer. Derfor har jeg satt inn en jordfuktmåler, da den hadde samme oppsettet i toppen slik som vannsensoren. 


## Bruk av skytjeneste
Ved bruk av tjenesten IFTTT har jeg forlenget Particle Protonet sin funksjonalitet. Jeg har koblet deres API opp mot fire andre tjenester. I tillegg til dette skrev jeg et script som kjører på telefonen min. Dette gir Particle Proton tilgang til en ny funksjon som kom med iOS 12, nemlig Siri Shortcuts.


## Nytteverdi
Denne gjenstanden har en reel nytteverdi for meg, da jeg allerede har klart å drepe et par planter ved å glemme å vanne dem. Jeg itererte over oppgaven flere ganger og la til mer og mer ettersom jeg kunne se bruksområder for tilleggs sensorer. Dette har blitt et prosjekt jeg verdsetter mye, og som jeg har ekspansjonsplaner for. Ved å ta dette emnet har jeg lært en rekke fascinerende ting. Det er en hel del hverdagsproblemer som enkelt kan bli løst med kun enkle _embedded_-kreasjoner.

Det endelige prosjektet føles som et sammenhengende produkt, hvor hver enkelt komponent spiller en rolle og at de sensorene som er benyttet kommer til sin rett. 

[1]:	https://kirary-fad13.web.app
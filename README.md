# NostecLogo
NostecLogo - Logo kalbos interpretatorius, veikiantis su Node.js karkasu.

Norėdami pasileisti projektą lokaliai, visų pirma atsisiųskite Node.js į savo kompiuterį.
Atsisųskite projektą ir išpakuokite jį į pasirinktą aplanką kompiuteryje.
Atsidarykite cmd.exe ir naudodami komandą cd nueikite į projekto direktoriją (kurioje yra app.js failas)
Tuomet įvykdykite komandas:
````
npm install
````
````
npm install -g nodemon
````
Tuomet norėdami paleisti programą įvykdykite komandą
````
npm start
````
Jei port'as yra užimtas, atsidarykite www failą esantį bin folderyje su teksto editoriumi ir pakeiskite eilutėje
var port = normalizePort(process.env.PORT || '8099'); skaičių 8099 į kokį nors kitą (pvz. 8010)

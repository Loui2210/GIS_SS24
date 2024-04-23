const monatsname=["Januar","Februar","März","April","Mai","Juni","Juli","August","September","Oktober","November","Dezember"];
const wochentag=[6,0,1,2,3,4,5];
// normalerweise wert 0-11 zurück somit wird Januar zu 0, usw
let jahr=document.querySelector(".jahr");
let monat=document.querySelector(".monat");
// Jahr und Monatselektor
let heute=new Date();
// Aktuelle Datum wird unter heute gespeichert

let aktJahr=heute.getFullYear();
let aktMonat=heute.getMonth();

jahr.textContent=aktJahr;
monat.textContent=monatsname[aktMonat];

let durchlaufDatum=new Date(heute);
//Hifsdatum da heutige Datum nicht geändert werden soll

let tabelle=document.querySelector("table");

let zaehlerTage=1;

function tageImMonat(paraDatum){
    let calcDatum=new Date(paraDatum);
    calcDatum.setMonth(calcDatum.getMonth()+1); //Monat wird um eins erhöht und um einen Tag abgezogen, somit weiß man wie viele Tage der aktuelle Monat hat
    calcDatum.setDate(0);
    return calcDatum.getDate();
}
for(let i=0;;i++){ //Daten auf Wochentage anpassen und beim letzen Tag im Monat stoppen
    let neueZeile=document.createElement("tr");
    tabelle.appendChild(neueZeile);
    for(let j=0;j<7;j++){
        let neueSpalte=document.createElement("td");
        neueZeile.appendChild(neueSpalte);
        durchlaufDatum.setDate(zaehlerTage);
        if(zaehlerTage<=tageImMonat(heute)){
            if(j==wochentag[durchlaufDatum.getDay()]){
                neueSpalte.innerHTML="<span>"+zaehlerTage+"</span>";
                zaehlerTage++;
            }
        }
        if(zaehlerTage-1===heute.getDate()){
            neueSpalte.children[0].classist.add("heuteSpan");
        }
    }
    if(zaehlerTage>tageImMonat(heute)){break;}
}
/**
 * Created by pauliuslegeckas on 10/03/2017.
 */
    //gaunant klaida pvz priekin100 (be tarpo) sako "As nezinau ka reiskia priekin100"
    //KIEKVIENA KOMANDA TURI TILPTI I VIENA EILUTE (arba skaidoma su ~ zenklu)

    //vvl - valyk.vezliuko.lauka - istrina piesimo lauka
    //pr 10 - eina i prieki desimt pikseliu (arba priekin 10)
    //at 50 - eina atgal 50 pikseliu (arba atgal 50)
    //dš 10 - pasisuka desinen 10 laipsniu (galima ir lietuviskom raidem ir ne)
    //kr 360/12 - pasisuka 30 laipsniu i kaire (turi suprast reiskinius)
    //pr 10*20 - eis priekin 200
    //pr 20 kr 120 pr 20 - turi suvokti kelias komandas is eiles
    //kartok 3 [pr 100 dš 120] - for'a prasuks ir tris kartus vykdys [pr 100 ds 120]

    //kaip aprasoma grupuota forma - ? tai kvadratas \n kartok 4 [pr 40 dš 90] \n taškas (cia taskas uzbaigia forma) ir gaunam zinute "Jus aprasete kvadratas"
    //taisyk "kvadratas (butinai su kabutem nes po ju pavadinimas) atidarys kodo editinimo langa, kur aprasyta kvadrato procedura (tai kvadratas \n kartok 4[...] \n taskas)
    //es arba eisim - pakelia piestuka (nepiesia vaikstant)
    //pš arba piešim - nuleidzia piestuka (piesia vaikstant)
    //pr :dydis - cia :dydis bus kintamasis, gali viena karta piesiant but 40, kita 60, kita 80
    //pr -:dydis - kintamasis su minuso zenklu

    //tai daug :n : dydis : kampas \n  kartok :n [pr :dydis ds :kampas] \n taskas
    //sitai vykdysime:
    //vvl daug 6 120 -90
    //vvl daug 8 150 135
    //vvl daug 40 100 153
    //daug 3 -100 -90 daug 3 -100 120

    //tai namas :s
    // daug 1 :s 90
    // daug 3 :s -120
    // daug 3 :s 90
    //taskas

    //aritmetinius simbolius galima suprasti taip: po skaiciaus arba kintamojo einantis simbolis jei yra aritmetinis, tai po to einantis stringas bus skaicius operuojantis su pries tai esanciu
    //aritmetiniai skaiciavimai rasomi su tarpais (pr 10 - 20) arba (pr (10 - 40) / 30)

    //SALYGINIAI (returnina tiesa arba melas)
    //if bus aprasomas zodziu jeigu, pvz(jeigu :dydis > 300 [baik]), cia [baik] bus ifo eilutes pabaiga
    //ifai yra skirti vykdyti ar nevykdyti pirmai eilutei po ifo (yra vienos eilutes skoupo)

    //pr.storiu 50 7 - cia vezliukas pies 7 lygiagrecias linijas ilgio 50 (tas pats kaip paeina 7, pasisuka 90, paeina 1, pasisuka 90, paeina 90 ir taip kol grizta i pradini taska) - baigia darba pradinej pozicijoj
    //~ naudojama kai nori perkelti eilutes tesini i kita eilute, t.y. viena eilute skaido i dvi, nors nori kad suvoktu kaip viena

    //tai pavadinimas :dydis :kampas     viduje galima kreiptis dar karta (rekursiskai) tai jos viduje bus    pavadinimas :dydis + 1 :kampas


    function getText() {
        var text = document.getElementById('inputCode').value;
        if (text != "") {
            logo.evaluateText(text);
            document.getElementById('inputCode').value = '';
            setText(text);
        }
    }


    function setText(text, isError) {
        if(isError == true){
            document.getElementById('enteredCode').value += text;
            document.getElementById("enteredCode").scrollTop = document.getElementById("enteredCode").scrollHeight; // visada rodo apatine dali
        } else {
            document.getElementById('enteredCode').value += text + '\n-------------\n';
            document.getElementById("enteredCode").scrollTop = document.getElementById("enteredCode").scrollHeight; // visada rodo apatine dali
        }
    }
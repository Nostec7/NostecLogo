/**
 * Created by pauliuslegeckas on 27/11/2017.
 */

var errUniversal;
var uiErr1;
var uiErr2;
var uiErr3;
var isTaskShowing = false;
var currentTaskName = null;
var currentTaskImages = null;
if(getCookie("language") == "Lietuviu"){
    errUniversal = "Klaida: ";
    uiErr1 = "Įvesta reikšmė nėra skaičius";
    uiErr2 = "Skaičius turi būti tarp 0 ir 255";
    uiErr3 = "Įvestas skaičius nėra šešioliktainio pavidalo";
} else{
    errUniversal = "Error: ";
    uiErr1 = "The input must be in numbers";
    uiErr2 = "The number must be between 0 and 255";
    uiErr3 = "The number you entered is not in hexadecimal format";
}

// Right-click menus
var cnv = document.getElementById('overlay');
var canvasMenuDisplayed = false;
var canvasMenuBox = window.document.querySelector(".canvas-right-click-menu");


/* Text Writing Menu */
function writeTextOnScreen(){
    var modal = document.getElementById('write-text-menu');
    var span = document.getElementsByClassName("close3")[0];
    var closeButton = document.getElementById("modal-window-cancel-button3");
    var setButton = document.getElementById("modal-window-set-button3");
    var textArea = document.getElementById("write-text-textcontent");
    var penColorButton = document.getElementById("colorPickerBackground");
    var fontSizeSelector = document.getElementById("font-size-selector");
    var fontNameSelector = document.getElementById("font-name-selector");

    fontSizeSelector.value = turtle.fontsize;
    fontNameSelector.value = turtle.fontname;
    textArea.fontsize = "" + fontSizeSelector.value + "pt";
    textArea.fontname = fontNameSelector.value;
    penColorButton.style.backgroundColor = turtle.color;
    textArea.value = "";
    textArea.style.color = turtle.color;
    modal.style.display = "block";

    fontSizeSelector.onchange = function(){
        textArea.style.fontSize = "" + fontSizeSelector.value + "pt";
    }
    fontNameSelector.onchange = function(){
        textArea.style.fontFamily = fontNameSelector.value;
    }

    span.onclick = function() {
        modal.style.display = "none";
        canvasMenuBox.style.display = "none";
    }
    closeButton.onclick = function() {
        modal.style.display = "none";
        canvasMenuBox.style.display = "none";
    }
    setButton.onclick = function() {


        turtle.fontname = fontNameSelector.value;
        turtle.fontsize = "" + fontSizeSelector.value;
        turtle.drawtext(textArea.value);

        addToVersionHistory();
        modal.style.display = "none";
        canvasMenuBox.style.display = "none";
    }
    window.onclick = function() {
        if (event.target == modal) {
            modal.style.display = "none";
            canvasMenuBox.style.display = "none";
        }
    }
}



function createNewTask(){
    var modal = document.getElementById("create-task-menu");
    var span = document.getElementsByClassName("close6")[0];
    var closeButton = document.getElementById("modal-window-cancel-button6");
    var setButton = document.getElementById("modal-window-set-button6");
    var nameTextArea = document.getElementById("create-task-name-content");
    var contentTextArea = document.getElementById("create-task-task-content");




    nameTextArea.value = "";
    nameTextArea.style.color = turtle.color;

    contentTextArea.value = "";
    contentTextArea.style.color = turtle.color;


    modal.style.display = "block";


    span.onclick = function() {
        modal.style.display = "none";
        canvasMenuBox.style.display = "none";
    }
    closeButton.onclick = function() {
        modal.style.display = "none";
        canvasMenuBox.style.display = "none";
    }
    setButton.onclick = function() {
       // alert(nameTextArea.value);
        if(nameTextArea.value == ""){
            alertCustomMessage("Pavadinimo laukas yra tuščias.");
            return;
        }

        AddTask(nameTextArea.value, contentTextArea.value);


        //addToVersionHistory();
        modal.style.display = "none";
        canvasMenuBox.style.display = "none";
    }
    window.onclick = function() {
        if (event.target == modal) {
            modal.style.display = "none";
            canvasMenuBox.style.display = "none";
        }
    }
}



function AddTask(name, description){

    document.getElementById("create-task-menu").style.display = 'block';
    document.getElementById("loading-overlay").style.display = 'block';
    document.getElementById("overlay-number").innerHTML = "0%";
    saveTeachersCanvas('teachers', name, description);

}


function insertTask(name, description, parent, images){
    var taskImages = images;
    //alert(taskImages.src);
        var snippet;
        snippet = document.createElement('div');
        snippet.className = 'snippet';
        snippet.addEventListener('click', function () {
            if(name != currentTaskName) {
                if (!isTaskShowing) {
                    document.getElementById("tasks-display-panel").style.display = 'block';
                    document.getElementById("current-task-name").innerHTML = name;
                    document.getElementById("current-task-description").innerHTML = description;
                    isTaskShowing = true;
                } else {
                    document.getElementById("current-task-name").innerHTML = name;
                    document.getElementById("current-task-description").innerHTML = description;
                }
            } else {
                if (!isTaskShowing) {
                    document.getElementById("tasks-display-panel").style.display = 'block';
                    isTaskShowing = true;
                } else {
                    document.getElementById("tasks-display-panel").style.display = 'none';
                    isTaskShowing = false;
                }
            }
            currentTaskImages = taskImages;
            currentTaskName = name;
            teachersTaskImages = currentTaskImages;
        });

        var container = document.createElement('pre');
        snippet.appendChild(container);
        container.appendChild(document.createTextNode(name));
        if (snippet.parentElement !== parent)
            parent.appendChild(snippet);
}

function markTaskAsCompleted(){
    for(var i = 0; i < document.getElementById("list-of-tasks").childElementCount; i++){
        var snippet = document.getElementById("list-of-tasks").children[i].children[0];
        if(snippet.innerHTML == currentTaskName){
            snippet.style.backgroundColor = "lightgrey";
            snippet.style.color = "grey";
        }
    }

}



function penWidthSelector(){
    var modal = document.getElementById('pen-width-menu');
    var span = document.getElementsByClassName("close")[0];
    var closeButton = document.getElementById("modal-window-cancel-button");
    var setButton = document.getElementById("modal-window-set-button");
    modal.style.display = "block";
    var widthInput = document.getElementById("width-slider-value");
    var slider = document.getElementById("pen-width-slider-range");
    var inputWidthValue;
    slider.value = turtle.penwidth;
    document.getElementById("width-slider-value").value = slider.value;

    slider.oninput = function() {
        document.getElementById("width-slider-value").value = slider.value; // update input field
    }

    widthInput.addEventListener('keydown', function(event) {
        if (event.key === "Enter") {
            inputWidthValue = widthInput.value; //get value of entered number
            if (isNaN(inputWidthValue)) {
                alertCustomMessage(uiErr1);
                //alert("The input must be in numbers"); //error on non-numeric input
                return false;
            } else{
                slider.value = inputWidthValue;
                document.getElementById("width-slider-value").value = slider.value;
            }
        }
    });

    span.onclick = function() {
        modal.style.display = "none";
        canvasMenuBox.style.display = "none";
    }
    closeButton.onclick = function() {
        modal.style.display = "none";
        canvasMenuBox.style.display = "none";
    }
    setButton.onclick = function() {
        turtle.penwidth = widthInput.value;
        modal.style.display = "none";
        canvasMenuBox.style.display = "none";
    }
    window.onclick = function() {
        if (event.target == modal) {
            modal.style.display = "none";
            canvasMenuBox.style.display = "none";
        }
    }
}
function alertCustomMessage(message){
    document.getElementById("error-message-field").innerText = message;
    var modal = document.getElementById('alert-menu');
    var span = document.getElementsByClassName("close5")[0];
    var dismissButton = document.getElementById("modal-window-dismiss-button");
    modal.style.display = "block";


    span.onclick = function() {
        modal.style.display = "none";
        canvasMenuBox.style.display = "none";
    }
    dismissButton.onclick = function() {
        modal.style.display = "none";
        canvasMenuBox.style.display = "none";
    }
    window.onclick = function() {
        if (event.target == modal) {
            modal.style.display = "none";
            canvasMenuBox.style.display = "none";
        }
    }
}


function backgroundImageUploader(){
    var modal = document.getElementById('background-menu');
    var span = document.getElementsByClassName("close4")[0];
    var closeButton = document.getElementById("modal-window-cancel-button4");
    var setButton = document.getElementById("modal-window-set-button4");
    modal.style.display = "block";

    document.getElementById('getImage').addEventListener('change', readURL, true);
    //document.getElementById('sandbox').addEventListener('change', readURL, true);

    span.onclick = function() {
        modal.style.display = "none";
        canvasMenuBox.style.display = "none";
    }
    closeButton.onclick = function() {
        modal.style.display = "none";
        canvasMenuBox.style.display = "none";
    }
    setButton.onclick = function() { // fixme: does not work on safari

        var canvas = document.querySelector('#sandbox');
        var backImage = new Image;
        backImage.src = backgroundResult;

        var ctmp = document.createElement('canvas');
        ctmp.width = canvas.width;
        ctmp.height = canvas.height;
        var ctx = ctmp.getContext('2d');
        var hRatio = ctmp.width  / backImage.width;
        var vRatio =  ctmp.height / backImage.height;
        var ratio  = Math.min ( hRatio, vRatio );

        var centerShift_x = ( ctmp.width - backImage.width*ratio ) / 2;
        var centerShift_y = ( ctmp.height - backImage.height*ratio ) / 2;
        ctx.clearRect(0,0,ctmp.width, ctmp.height);
        ctx.drawImage(backImage, 0,0, backImage.width, backImage.height, 0, centerShift_y, ctmp.width, backImage.height * ratio);


        var backgroundImg = new Image;

        backgroundImg.src = ctmp.toDataURL();
        window.console.log('reached');

        //window.console.log(backgroundImg);
        backgroundImg.onload = function(){


            turtle.drawImage(backgroundImg, 0, 0, canvas.width, canvas.height);
            //addToVersionHistory();
            addToVersionHistory();
        }



        modal.style.display = "none";
        canvasMenuBox.style.display = "none";

    }
    window.onclick = function() {
        if (event.target == modal) {
            modal.style.display = "none";
            canvasMenuBox.style.display = "none";
        }
    }
}

var backgroundResult;


function readURL(){
    var file = document.getElementById("getImage").files[0];
    var reader = new FileReader();
    reader.onloadend = function(){
        document.getElementById('background-preview').style.backgroundImage = "url(" + reader.result + ")";
        //document.getElementById('back-of-main-canvas').style.backgroundImage = "url(" + reader.result + ")";
        backgroundResult = reader.result;
    }
    if(file){
        reader.readAsDataURL(file);
    }else{
    }
}





function colorSelector(tool){

    var modal = document.getElementById('color-menu');
    var span = document.getElementsByClassName("close2")[0];
    var closeButton = document.getElementById("modal-window-cancel-button2");
    var setButton = document.getElementById("modal-window-set-button2");
    modal.style.display = "block";

    /*colors*/
    var body = document.getElementById('generated-color-box'),
        r = document.querySelector('#r'),
        g = document.querySelector('#g'),
        b = document.querySelector('#b'),
        r_out = document.querySelector('#r_out'),
        g_out = document.querySelector('#g_out'),
        b_out = document.querySelector('#b_out'),
        hex_out = document.querySelector('#hex');


    //change to existing color while entering the color selector
    if(tool == 'pen'){
        document.getElementById("color-selection-heading").textContent = "Pasirinkite pieštuko spalvą";
        var startingColorHex = turtle.color;
    } else if(tool == 'background'){
        document.getElementById("color-selection-heading").textContent = "Pasirinkite fono spalvą";
        var startingColorHex = turtle.bgcolor;
    }

    var tempr = startingColorHex.substring(1, 3);
    var tempg = startingColorHex.substring(3, 5);
    var tempb = startingColorHex.substring(5, 7);

    var redDecimal = parseInt(tempr, 16);
    var greenDecimal = parseInt(tempg, 16);
    var blueDecimal = parseInt(tempb, 16);

    document.getElementById("r_out").value = redDecimal;
    document.getElementById("g_out").value = greenDecimal;
    document.getElementById("b_out").value = blueDecimal;

    document.querySelector('#r').value = redDecimal;
    document.querySelector('#g').value = greenDecimal;
    document.querySelector('#b').value = blueDecimal;
    setColor();

    var redInput = document.getElementById("r_out"),
        greenInput = document.getElementById("g_out"),
        blueInput = document.getElementById("b_out");

    var redValue, greenValue, blueValue;
    function setColor(){
        var r_hex = parseInt(r.value, 10).toString(16),
            g_hex = parseInt(g.value, 10).toString(16),
            b_hex = parseInt(b.value, 10).toString(16),
            hex = "#" + pad(r_hex) + pad(g_hex) + pad(b_hex);
        body.style.backgroundColor = hex;
        hex_out.value = hex;
    }


    function pad(n){
        return (n.length<2) ? "0"+n : n;
    }

    r.addEventListener('change', function() {
        setColor();
        r_out.value = r.value;
    }, false);

    r.addEventListener('input', function() {
        setColor();
        r_out.value = r.value;
    }, false);

    g.addEventListener('change', function() {
        setColor();
        g_out.value = g.value;
    }, false);

    g.addEventListener('input', function() {
        setColor();
        g_out.value = g.value;
    }, false);

    b.addEventListener('change', function() {
        setColor();
        b_out.value = b.value;
    }, false);

    b.addEventListener('input', function() {
        setColor();
        b_out.value = b.value;
    }, false);

    redInput.addEventListener('keydown', function(event) {
        if (event.key === "Enter" || event.key === "Tab") {
            redValue = redInput.value; //get value of entered number
            if (isNaN(redValue) || redValue < 0 || redValue > 255) {
                alertCustomMessage(errUniversal + uiErr2);
                //alert("The number must be between 0 and 255"); //error on non-numeric input
                return false;
            } else{
                r.value = redValue;
                setColor();
                document.querySelector('#r').value = r.value;
            }
        }
    });
    greenInput.addEventListener('keydown', function(event) {
        if (event.key === "Enter" || event.key === "Tab") {
            greenValue = greenInput.value; //get value of entered number
            if (isNaN(greenValue) || greenValue < 0 || greenValue > 255) {
                alertCustomMessage(errUniversal + uiErr2);
                //alert("The number must be between 0 and 255"); //error on non-numeric input
                return false;
            } else{
                g.value = greenValue;
                setColor();
                document.querySelector('#g').value = g.value;
            }
        }
    });
    blueInput.addEventListener('keydown', function(event) {
        if (event.key === "Enter" || event.key === "Tab") {
            blueValue = blueInput.value; //get value of entered number
            if (isNaN(blueValue) || blueValue < 0 || blueValue > 255) {
                alertCustomMessage(errUniversal + uiErr2);
                //alert("The number must be between 0 and 255"); //error on non-numeric input
                return false;
            } else{
                b.value = blueValue;
                setColor();
                document.querySelector('#b').value = b.value;
            }
        }
    });
    hex_out.addEventListener('keydown', function(event) {
        if (event.key === "Enter" || event.key === "Tab") {
            var hexValue = hex_out.value;
            var tempred = hexValue.substring(1, 3);
            var tempgreen = hexValue.substring(3, 5);
            var tempblue = hexValue.substring(5, 7);

            var redDcml = parseInt(tempred, 16);
            var greenDcml = parseInt(tempgreen, 16);
            var blueDcml = parseInt(tempblue, 16);


            var isHexSign = true;
            var existingSign = hexValue.substring(0, 1);
            if(existingSign != '#'){
                isHexSign = false;
                alertCustomMessage(errUniversal + uiErr3);
                //alert('The number you entered is not in hexadecimal format');
            }
            if(isHexSign == true){
                r.value = redDcml;
                g.value = greenDcml;
                b.value = blueDcml;
                r_out.value = r.value;
                g_out.value = g.value;
                b_out.value = b.value;
                setColor();
            }
        }
    });


    var colorCombinations = [];
    for(var i = 0; i < 95; i++){
        colorCombinations.push(document.getElementById("color" + (i + 1)));
    }

    colorCombinations.forEach(function(elem) {
        elem.addEventListener("click", function() {
            getPaletteColor(elem);
        });
    });

    // Sort the color palette in position
    var startingLeft = 0;
    var startingBottom = 115;

    for (var j = 1; j <= colorCombinations.length; j++) {
        colorCombinations[j-1].style.bottom = "" + startingBottom + "px";
        startingBottom -= 25;
        if(j % 5 == 0){
            startingBottom = 115;
        }
    }
    for(var x = 1; x <= colorCombinations.length; x++){
        colorCombinations[x-1].style.left = "" + startingLeft + "px";
        if(x % 5 == 0){
            startingLeft+=30;
        }

    }

    function getPaletteColor(colorObject){
        var hexCol = rgb2hex(colorObject.style.backgroundColor);
        var tempR = hexCol.substring(1, 3);
        var tempG = hexCol.substring(3, 5);
        var tempB = hexCol.substring(5, 7);

        redDecimal = parseInt(tempR, 16);
        greenDecimal = parseInt(tempG, 16);
        blueDecimal = parseInt(tempB, 16);
        document.querySelector('#r').value = redDecimal;
        document.querySelector('#g').value = greenDecimal;
        document.querySelector('#b').value = blueDecimal;
        r_out.value = r.value;
        g_out.value = g.value;
        b_out.value = b.value;
        setColor();
    }

    function rgb2hex(rgb) {
        rgb = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
        function hex(x) {
            return ("0" + parseInt(x).toString(16)).slice(-2);
        }
        return "#" + hex(rgb[1]) + hex(rgb[2]) + hex(rgb[3]);
    }

    // end of color presets
    /*-colors*/

    span.onclick = function() {
        modal.style.display = "none";
        canvasMenuBox.style.display = "none";
    }
    closeButton.onclick = function() {
        modal.style.display = "none";
        canvasMenuBox.style.display = "none";
    }
    setButton.onclick = function() {
        if(tool == 'pen'){
            turtle.color = hex_out.value;
        } else if(tool == 'background'){
            turtle.bgcolor = hex_out.value;
        }

        var textArea = document.getElementById("write-text-textcontent");
        var penColorButton = document.getElementById("colorPickerBackground");
        textArea.style.color = hex_out.value;
        penColorButton.style.backgroundColor = hex_out.value;
        modal.style.display = "none";
        canvasMenuBox.style.display = "none";
    }
    window.onclick = function() {
        if (event.target == modal) {
            modal.style.display = "none";
            canvasMenuBox.style.display = "none";
        }
    }
    return hex_out;
}


// Language selection
function setLanguageToEN(){
    setCookie("language", "English");
    //localStorage.setItem("language-selection", "English");
    window.location.reload();
}
function setLanguageToLT(){
    setCookie("language", "Lietuviu");
    //localStorage.setItem("language-selection", "Lietuviu");
    window.location.reload();
}

function clearHistory(){
    if (!confirm('Clear history: Are you sure?')) return;
    clearhistoryhook();
}
function clearVersionHistory(){
    if (!confirm('Clear history: Are you sure?')) return;
    //clearhistoryhook();
}

function openTab(evt, tabName) {
    var i, x, tablinks;
    x = document.getElementsByClassName("tab");
    for (i = 0; i < x.length; i++) {
        x[i].style.display = "none";
    }
    tablinks = document.getElementsByClassName("tablink");
    for (i = 0; i < x.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" tab-selected", "");
    }
    document.getElementById(tabName).style.display = "block";
    evt.currentTarget.className += " tab-selected";

    var btn;

    if(tabName == 'TasksTab') {
        /*document.getElementById("display-panel").style.display = 'none';
        document.getElementById("VersionHistory").style.display = 'none';
        document.getElementById("version-history-toggle").style.display = 'none';
        document.getElementById("input-panel").style.display = 'none';
        document.getElementById("tasks-display-panel").style.display = 'block';
        document.getElementById("in-panel-history-button").style.display = 'block';*/



    } else{
        /*document.getElementById("display-panel").style.display = 'block';
        document.getElementById("VersionHistory").style.display = 'block';
        document.getElementById("version-history-toggle").style.display = 'block';
        document.getElementById("input-panel").style.display = 'block';
        document.getElementById("tasks-display-panel").style.display = 'none';
        document.getElementById("in-panel-history-button").style.display = 'none';*/
    }

    if(tabName == 'HelpTab'){

        if(getCookie("language") == "English"){
            document.getElementById("en-help-content").style.display = 'block';
            document.getElementById("lt-help-content").style.display = 'none';
        } else{
            document.getElementById("en-help-content").style.display = 'none';
            document.getElementById("lt-help-content").style.display = 'block';
        }
    } else if(tabName == 'HistoryTab') {
        document.getElementById('in-panel-history-button').style.display = 'block';
    } else{
        document.getElementById('in-panel-history-button').style.display = 'none';
    }
}




/*var sidbr = document.getElementById('sidebar');
var sidebarMenuDisplayed = false;
var sidebarMenuBox = window.document.querySelector(".sidebar-right-click-menu");*/

//canvas right-click menu & disable other right-clicked menus
cnv.oncontextmenu = function() {
    var left = arguments[0].clientX;
    var top = arguments[0].clientY;

    canvasMenuBox.style.left = left + "px";
    canvasMenuBox.style.top = top + "px";
    canvasMenuBox.style.display = "block";

    arguments[0].preventDefault();
    canvasMenuDisplayed = true;
   // sidebarMenuBox.style.display = "none";
    return false;
};

//sidebar right-click menu & disable other right-clicked menus
/*sidbr.oncontextmenu = function() {
    var left = arguments[0].clientX;
    var top = arguments[0].clientY;

    sidebarMenuBox.style.left = left + "px";
    sidebarMenuBox.style.top = top + "px";
    sidebarMenuBox.style.display = "block";
    arguments[0].preventDefault();
    sidebarMenuDisplayed = true;
    canvasMenuBox.style.display = "none";
    return false;
}*/

//disable every menu on left click
/*sidbr.addEventListener("click", function() {
    if(sidebarMenuDisplayed == true || canvasMenuDisplayed == true){
        sidebarMenuBox.style.display = "none";
        canvasMenuBox.style.display = "none";
    }
}, true);*/
cnv.addEventListener("click", function() {
    if(canvasMenuDisplayed == true){
        canvasMenuBox.style.display = "none";
        canvasMenuBox.style.display = "none";
       // sidebarMenuBox.style.display = "none";
    }
}, true);


function toggleVersionHistoryWindow(){
    var versionWindow = document.getElementById("VersionHistory");
    var toggleButton = document.getElementById("version-history-toggle");
    if(toggleButton.value == "down"){
        versionWindow.style.height="150px";
        toggleButton.style.top = "141px";
        toggleButton.innerHTML = "&#8679;";
        toggleButton.value = "up";
    } else {
        versionWindow.style.height="20px";
        toggleButton.style.top = "11px";
        toggleButton.innerHTML = "&#8681;";
        toggleButton.value = "down";
    }
}
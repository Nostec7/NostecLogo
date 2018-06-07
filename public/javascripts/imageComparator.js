/**
 * Created by pauliuslegeckas on 27/11/2017.
 */

var multipleTeacherImages = true;
var numberOfTeachersImages = 30; //
var taskImages = [];
var croppedTaskImages = [];
var taskName;
var taskDescription;
var canvasCurr = document.querySelector('#sandbox'); // current canvas
var imageComparingTreshold = 60; //Percentage of comparison in pixel equality
var teachersTaskImages = []; //TODO: make this double array so that first index could be [taskNr] and second [taskImage]. 1 taskNr has 359 taskImages
var pictureIndex = 0;
var matchFailCounter = 0;
var backgroundColor = "255,255,255,255";

function cropImage(canvasToCrop, imageOnCanvas){
    let topMost = canvasToCrop.height;
    let bottomMost = 0;
    let leftMost = canvasToCrop.width;
    let rightMost = 0;

    let ctx = canvasToCrop.getContext('2d');

    let pxl = ctx.getImageData(0, 0, canvasToCrop.width, canvasToCrop.height).data;
    let pxlArr = [[]];
    let x = 0;
    let xCor = 0;
    let yCor = 0;

    let xArr = [];
    let yArr = [];

    let i = 0;
    while(i <= pxl.length){
        if(i == (yCor+1) * (((canvasToCrop.width + 1) * 4) - 4)){
            yCor++;
            xCor = 0;
        }
        pxlArr[x[yCor]] = "" + pxl[i] + ',' + pxl[i + 1] + ',' + pxl[i + 2] + ',' + pxl[i + 3];

        if(pxlArr[x[yCor]] != backgroundColor){
            xArr.push(xCor);
            yArr.push(yCor);
        }
        xCor++;
        i+=4;
        x++;
    }

    for(let j = 0; j < xArr.length; j++){
        if(xArr[j] != 0 && xArr[j] != canvasToCrop.width){
            if(leftMost > xArr[j]){
                leftMost = xArr[j];
            }
            if(rightMost < xArr[j]){
                rightMost = xArr[j];
            }
        }
    }

    for(var j = 0; j < yArr.length; j++){
        if(yArr[j] != 0 && yArr[j] != canvasToCrop.height){
            if(bottomMost < yArr[j]){
                bottomMost = yArr[j];
            }
            if(topMost > yArr[j]){
                topMost = yArr[j];
            }
        }
    }
    const croppedCanvas = document.createElement('canvas');
    croppedCanvas.width = rightMost - leftMost + 1;
    croppedCanvas.height = bottomMost - topMost + 1;
    croppedCanvas.getContext('2d').drawImage(imageOnCanvas, -leftMost, -topMost, imageOnCanvas.width, imageOnCanvas.height);

    const croppedImg = new Image;
    croppedImg.src = croppedCanvas.toDataURL("image/png");
    window.console.log(croppedImg);
    return croppedCanvas;
}



function compareTaskImages(){
    setTimeout(function(){ //make sure version history is in place
        window.console.log('-----compare started-----');
        var studentsImageData = lastVersionInHistory;
        var teachersImageData = teachersCanvas; // new one
        generateTeacherAndStudentCanvas(teachersImageData, studentsImageData, waitAndCropAndCompare);
    }, 500);
}





function generateTeacherAndStudentCanvas(teachersImageData, studentsImageData, waitAndCropAndCompare){


    var matchingInSizeTeachersImages = [];
    matchFailCounter = 0;
    //Students image for comparison
    var studentsImage = new Image;
    studentsImage.src = studentsImageData;
    var studentsCanvas = document.createElement('canvas');
    studentsCanvas.width = studentsImage.width;
    studentsCanvas.height = studentsImage.height;
    studentsCanvas.getContext('2d').drawImage(studentsImage, 0, 0, studentsImage.width, studentsImage.height);

    if(studentsCanvas.toDataURL().length === 6){ // 6 - static number when canvas is empty
        setTimeout(function(){
            generateTeacherAndStudentCanvas(teachersImageData, studentsImageData, waitAndCropAndCompare);
            return;
        }, 50);
    } else{
        var croppedStudentsCanvas = cropImage(studentsCanvas, studentsImage);
        compareImageSizes(croppedStudentsCanvas, matchingInSizeTeachersImages);
        waitAndCropAndCompare(matchingInSizeTeachersImages, croppedStudentsCanvas, compareImages, studentsCanvas, studentsImage);
    }

}

function compareImageSizes(croppedStudentsCanvas, matchingInSizeTeachersImages){

    var croppedStudentImage = new Image;
    croppedStudentImage.src = croppedStudentsCanvas.toDataURL();

    for(var i = 0; i < teachersTaskImages.length; i++){ //run through every teachers image and find the ones matching according to width and height
        if((Math.abs(croppedStudentImage.width - teachersTaskImages[i].width) <= 2 ) && (Math.abs(croppedStudentImage.height - teachersTaskImages[i].height) <= 2)){

            var matchingInSizeTeachersCanvas = document.createElement('canvas');
            matchingInSizeTeachersCanvas.width = teachersTaskImages[i].width;
            matchingInSizeTeachersCanvas.height = teachersTaskImages[i].height;
            matchingInSizeTeachersCanvas.getContext('2d').drawImage(teachersTaskImages[i], 0, 0, teachersTaskImages[i].width, teachersTaskImages[i].height);

            matchingInSizeTeachersImages.push(matchingInSizeTeachersCanvas);
        }
    }

}




function waitAndCropAndCompare(matchingInSizeTeachersImages, croppedStudentsCanvas, compareImages, studentsCanvas, studentsImage){

    if(matchingInSizeTeachersImages.length == 0 && matchFailCounter <= 5){
        setTimeout(function(){
            compareImageSizes(croppedStudentsCanvas, matchingInSizeTeachersImages);
            waitAndCropAndCompare(matchingInSizeTeachersImages, croppedStudentsCanvas, compareImages, studentsCanvas, studentsImage);
            matchFailCounter++;
            return;
        }, 50);
    } else if(matchFailCounter > 5){
        //alert('Sorry, but the images do not match.'); // FINAL NOT FOUND
        alertCustomMessage('Deja, užduotis išspręsta neteisingai.');
        return;
    } else{
        compareImages(matchingInSizeTeachersImages, croppedStudentsCanvas);
    }

}


/* // FUNCTION WITH COMPARISON DEBUGGING
function compareImages(croppedTeachersCanvas, croppedStudentsCanvas){

    window.console.log(croppedTeachersCanvas.length);

    var found = false;
    for(var k = 0; k < croppedTeachersCanvas.length; k++) {
        if(found == false) {
            var imgStudentFinal = new Image;
            imgStudentFinal.src = croppedStudentsCanvas.toDataURL();

            var ctx = croppedTeachersCanvas[k].getContext('2d');
            var imageData = ctx.getImageData(0, 0, croppedTeachersCanvas[k].width, croppedTeachersCanvas[k].height);
            var pixels = imageData.data;

            var croppedTeacherImg = new Image;
            croppedTeacherImg.src = croppedTeachersCanvas[k].toDataURL();
            window.console.log(croppedTeacherImg);
            croppedTaskImages.push(croppedTeacherImg);

            var ctx2 = croppedStudentsCanvas.getContext('2d');
            var imageData2 = ctx2.getImageData(0, 0, croppedStudentsCanvas.width, croppedStudentsCanvas.height);
            var pixels2 = imageData2.data;

            window.console.log('students width:  ' + croppedStudentsCanvas.width);
            window.console.log('students height: ' + croppedStudentsCanvas.height);

            var matching = 0;
            var border1pixels = 0;
            var border2pixels = 0;

            for (var i = 0, il = pixels.length; i < il; i++) {
                if (pixels[i] != 255) {

                    border1pixels++;
                    if (pixels2[i] != 255) {
                        matching++;
                    }
                }
                if (pixels2[i] != 255) {
                    border2pixels++;
                }
            }

            window.console.log('teachers px: ' + border1pixels);
            window.console.log('students px: ' + border2pixels);
            window.console.log('same px: ' + matching);

            if ((Math.abs(100 - (border2pixels * 100 / border1pixels)) <= (100 - imageComparingTreshold) && matching >= (border1pixels / (100 - imageComparingTreshold))) ||
                (border1pixels == matching && Math.abs(100 - (border2pixels * 100 / border1pixels)) <= ((100 - imageComparingTreshold) * 2))) {
                window.console.log('Success! The images match!');
                alertCustomMessage('Success, images match!');
                found = true;

            }

            window.console.log('matching criteria');
            window.console.log('border1/border2 ratio: ' + Math.abs(100 - (border2pixels * 100 / border1pixels)));
            window.console.log('matching >= treshold (10%): ' + (matching >= (border1pixels / (100 - imageComparingTreshold))));
        } else{
            break;
        }
    }
    if(found == false){
        //alert('No matching images found');
        alertCustomMessage('No matching images found');
        window.console.log('SORRY, but images do not match..');
    }
}
*/

var backgroundPixelColor = 255;


function compareImages(croppedTeachersCanvas, croppedStudentsCanvas){
    let found = false;
    for(let k = 0; k < croppedTeachersCanvas.length; k++) {
        if(found == false) {
            let imgStudentFinal = new Image;
            imgStudentFinal.src = croppedStudentsCanvas.toDataURL();

            let ctx = croppedTeachersCanvas[k].getContext('2d');
            let teacherImageData = ctx.getImageData(0, 0, croppedTeachersCanvas[k].width, croppedTeachersCanvas[k].height);
            let teachersPixels = teacherImageData.data;

            let croppedTeacherImg = new Image;
            croppedTeacherImg.src = croppedTeachersCanvas[k].toDataURL();
            croppedTaskImages.push(croppedTeacherImg);

            let ctx2 = croppedStudentsCanvas.getContext('2d');
            let studentImageData = ctx2.getImageData(0, 0, croppedStudentsCanvas.width, croppedStudentsCanvas.height);
            let studentsPixels = studentImageData.data;

            let matching = 0;
            let borderTeachersPixels = 0;
            let borderStudentsPixels = 0;
            for (let i = 0, il = teachersPixels.length; i < il; i++) {
                if (teachersPixels[i] != backgroundPixelColor) {
                    borderTeachersPixels++;
                    if (studentsPixels[i] != backgroundPixelColor) {
                        matching++;
                    }
                }
                if (studentsPixels[i] != backgroundPixelColor) {
                    borderStudentsPixels++;
                }
            }
            if ((Math.abs(100 - (borderStudentsPixels * 100 / borderTeachersPixels))
                <= (100 - imageComparingTreshold) && matching >= (borderTeachersPixels / (100 - imageComparingTreshold))) ||
                (teachersPixels == matching && Math.abs(100 - (borderStudentsPixels * 100 / borderTeachersPixels))
                <= ((100 - imageComparingTreshold) * 2))) {
                alertCustomMessage('Užduotis sėkmingai įvykdyta!');
                markTaskAsCompleted();
                found = true;
            }
        } else{
            break;
        }
    }
    if(!found){
        alertCustomMessage('Deja, užduotis išspręsta neteisingai.');
    }
}




function saveCanvasLocally(versionName){
    versionHistory.push(canvasCurr.toDataURL());
    lastVersionInHistory = canvasCurr.toDataURL();
}

function saveTeachersCanvas(versionName, name, description){
    setTimeout(function(){ // necessary to wait for version image to update

        window.console.log('-----save started-----');
        pictureIndex = 0;

        taskImages = [];
        //duplicateImages(versionName);


        if(multipleTeacherImages){
            var degrees = 0;
            var degreesToturn = 360/numberOfTeachersImages;
            for(var i = 0; i < numberOfTeachersImages; i++) {


                createCanvasFromImage(versionName, cropAndSaveCanvas, degrees);
                degrees += degreesToturn;

            }

            taskName = name;
            taskDescription = description;


        } else{
            createCanvasFromImage(versionName, cropAndSaveCanvas);
        }




    }, 500);
}

function createCanvasFromImage(versionName, callback, degreesToRotate){


    var img1 = new Image; // need 359 images (or 35 for beginning)
    img1.src = canvasCurr.toDataURL();
    //window.console.log(img1);


    if(degreesToRotate){
        var rotationCanvas = document.createElement('canvas');

        //save some time cropping image by using these size differentiators
        if(degreesToRotate == 0 ||
            degreesToRotate == 90 ||
            degreesToRotate == 180 ||
            degreesToRotate == 270){ //

            rotationCanvas.width = img1.width; // compensate for crop during rotation
            rotationCanvas.height = img1.height;

        } else if(degreesToRotate <= 22.5 ||
            (degreesToRotate > 67.5 && degreesToRotate < 90) ||
            (degreesToRotate > 90 && degreesToRotate <= 112.5) ||
            (degreesToRotate > 157.5 && degreesToRotate < 180) ||
            (degreesToRotate > 180 && degreesToRotate <= 202.5) ||
            (degreesToRotate > 247.5 && degreesToRotate < 270) ||
            (degreesToRotate > 270 && degreesToRotate <= 292.5) ||
            (degreesToRotate > 337.5 && degreesToRotate < 360)){

            rotationCanvas.width = img1.width * 1.25; // compensate for crop during rotation
            rotationCanvas.height = img1.height * 1.25;

        } else if(degreesToRotate > 22.5 && degreesToRotate <= 67.5 ||
            (degreesToRotate > 112.5 && degreesToRotate <= 157.5) ||
            (degreesToRotate > 202.5 && degreesToRotate <= 247.5) ||
            (degreesToRotate > 292.5 && degreesToRotate <= 337.5)){

            rotationCanvas.width = img1.width * 1.5; // compensate for crop during rotation
            rotationCanvas.height = img1.height * 1.5;
        }


        var rotctx = rotationCanvas.getContext('2d');

        rotctx.save();
        rotctx.fillStyle = turtle.bgcolor;
        rotctx.fillRect(0,0, rotationCanvas.width, rotationCanvas.height);

        rotctx.translate(rotationCanvas.width/2, rotationCanvas.height/2);
        rotctx.rotate(degreesToRotate * Math.PI/180); //

        rotctx.drawImage(img1, -(img1.width/2), -(img1.height/2));
        rotctx.restore();

        var rotatedImg = new Image;
        rotatedImg.src = rotationCanvas.toDataURL();
        //window.console.log(rotatedImg);

        img1 = rotatedImg;

    }


    var canvas = document.createElement('canvas');
    canvas.width = img1.width;
    canvas.height = img1.height;
    canvas.getContext('2d').drawImage(img1, 0, 0, img1.width, img1.height);

    //window.console.log(canvas.toDataURL().length);
    if(canvas.toDataURL().length === 6){
        setTimeout(function(){
            createCanvasFromImage(versionName, cropAndSaveCanvas, degreesToRotate);
            return;
        }, 50);
    } else{
        callback(versionName, canvas, img1);
    }

    return img1;
}

var taskImageDataArr = [];

function cropAndSaveCanvas(versionName, canvas, img1){
    var croppedTeachersCanvas = cropImage(canvas, img1);

    var tempTaskImg = new Image();
    tempTaskImg.src = croppedTeachersCanvas.toDataURL();

    //something with ecnoding/decoding does not work
    var dataUrl = croppedTeachersCanvas.toDataURL("image/jpeg").replace(/^data:image\/(png|jpg|jpeg);base64,/, "").replace(" ", "");

    taskImageDataArr.push(dataUrl);



    taskImages.push(tempTaskImg);

    var totalIdToPrint = numberOfTeachersImages-1;
    window.console.log('id: ' + pictureIndex + ' of ' + totalIdToPrint);
    window.console.log('cropped width:  ' + croppedTeachersCanvas.width);
    window.console.log('cropped height" ' + croppedTeachersCanvas.height);


    pictureIndex++;

    var newImage = new Image;
    newImage.src = croppedTeachersCanvas.toDataURL();

    teachersTaskImages.push(newImage);
    teachersCanvas = croppedTeachersCanvas.toDataURL();

    var completionPercentage = Math.round(pictureIndex / numberOfTeachersImages * 100);
    var completionPercentageText = "" + completionPercentage + "%";

    document.getElementById("overlay-number").innerHTML = completionPercentageText;
    if(pictureIndex == numberOfTeachersImages){
        setTimeout(function(){
            document.getElementById("loading-overlay").style.display='none';
            var tasksTab = document.getElementById("TasksTab");

            var taskTab = document.getElementById("list-of-tasks");
            console.log(taskImages);
            insertTask(taskName, taskDescription, taskTab, taskImages);
            alertCustomMessage('Užduotis sėkmingai įkelta.');
            console.log(taskImageDataArr);

            writeTaskToDB(taskName, taskDescription, taskImageDataArr);
        }, 300);
    }
}



function loadCanvasLocally(versionName){
    //var canvasTemp = document.querySelector('#sandbox');
    //loading of canvas from local directory
    //var dataURL = localStorage.getItem(versionName);
    var dataURL;
    if(versionName == 'teachers'){
        dataURL = teachersCanvas;
    } else{
        dataURL = versionHistory[versionName]; // new one
    }
    var img = new Image;
    img.src = dataURL;
    img.onload = function () {
        //window.console.log(img); // creates an image (could be used as version history item)
        turtle.drawImage(img);
        var canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        canvas.getContext('2d').drawImage(img, 0, 0, img.width, img.height);
        //saveCanvasLocally('lastversion'); // save selected version as the latest for comparing purposes
        lastVersionInHistory = canvasCurr.toDataURL();
        //localStorage.setItem('lastversion', canvasCurr.toDataURL());
    };
}


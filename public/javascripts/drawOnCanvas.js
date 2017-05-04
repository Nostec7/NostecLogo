/**
 * Created by pauliuslegeckas on 10/03/2017.
 */
document.addEventListener('DOMContentLoaded',domloaded,false);
var lineStartingPossX = [], lineStartingPossY = [];
var lineEndingPossX = [], lineEndingPossY = [];
var lineColors = [], lineWidths = [];
function domloaded(){

    (function() {
        var canvas = document.getElementById('drawingCanvas'), ctx = canvas.getContext('2d');



        var startingPosX, startingPosY;
        var endingPosX, endingPosY;
        var lineColor, lineWidth;

        canvas.width = window.innerWidth*.8-130;
        canvas.height = window.innerHeight-95;

        var centerX = canvas.width / 2;
        var centerY = canvas.height / 2;

        lineColor = "#000000";
        lineWidth = logoLineWidth;

        ctx.strokeStyle = lineColor;
        ctx.lineJoin = "round";
        ctx.lineWidth = lineWidth;

        var xoffset = centerX;
        var yoffset = centerY;
        var canvasx = xoffset;
        var canvasy = yoffset;
        var canvaspen = true;



        ctx.beginPath();
        ctx.moveTo(canvasx, canvasy);

        ctx.closePath();
        logo.Turtle.onMove(onMove);
        logo.Turtle.onPen(onPen);

        function onMove(x, y) {
            startingPosX = canvasx;
            startingPosY = canvasy;

            if (!canvaspen) {
                canvasx = xoffset + x;
                canvasy = yoffset - y;
                return;
            }
            canvasx = xoffset + x;
            canvasy = yoffset - y;
            //console.log(startingPosY + "   " + canvasy);

            endingPosX = canvasx;
            endingPosY = canvasy;


            //ADDING LINE TO ARRAY
            lineStartingPossX.push(startingPosX);
            lineStartingPossY.push(startingPosY);
            lineEndingPossX.push(endingPosX);
            lineEndingPossY.push(endingPosY);
            lineColors.push(lineColor);
            //lineWidths.push(lineWidth);

        };
        function onPen(pen) {
            canvaspen = pen;
        };

        window.addEventListener('resize', resizeCanvas, false);

        function resizeCanvas() {
            console.log("resizing");
            canvas.width = window.innerWidth*.8-130;
            canvas.height = window.innerHeight-95;

            drawStuff(); // draw while resizing
            //setInterval(function(){ drawStuff() }, 200);
        }

        setInterval(function(){ resizeCanvas() }, 200); //render every 200 ms

        function drawStuff() {


            // do your drawing stuff here
            function drawLine(startingX, startingY, endingX, endingY, color, width){
                //draw line
                ctx.beginPath();
                ctx.moveTo(startingX,startingY);
                ctx.lineTo(endingX,endingY);
                ctx.lineWidth = width;
                ctx.strokeStyle = color;
                ctx.closePath();
                ctx.stroke();
            }
            //drawLine(0,100,200,400, "#ff0000", 2); // pvz

            function drawRectangle(x,y,width,height, fillColor, strokeColor, strokeWidth){
                ctx.fillStyle = fillColor;
                ctx.strokeStyle = strokeColor;
                ctx.strokeWidth = strokeWidth;
                ctx.fillRect(x, y, width, height);
                ctx.strokeRect(x, y, width, height);
            }
            //drawRectangle(0,0,50,90,"#ff0000", "#ffffff", 1); // pvz

            function drawCircle(x, y, radius, fillColor, strokeColor, strokeWidth){
                //draw circle
                ctx.beginPath();
                ctx.arc(x,y,radius,0,2*Math.PI);
                ctx.fillStyle = fillColor;
                ctx.fill();
                ctx.strokeStyle = strokeColor;
                ctx.strokeWidth = strokeWidth;
                ctx.stroke();
            }
            //drawCircle(centerX, centerY, 20, "#555555", "#0000ff", 1); // pvz

            function drawText(x, y, text, fontSize, fontName, fillColor, strokeColor, strokeWidth){
                //draw text
                ctx.font = "" + fontSize + "px " + fontName;
                ctx.fillStyle = fillColor;
                ctx.fillText(text, x, y);
                ctx.strokeStyle = strokeColor;
                ctx.strokeWidth = strokeWidth;
                ctx.strokeText(text, x, y);
            }
            //drawText(300,100,"Hello world", "30", "Arial", "#000000", "#00ff00", 1); // pvz

            function loadImage(imageID, positionX, positionY, rotation, width, height){
                var img = document.getElementById(imageID);
                ctx.save();
                ctx.translate( positionX, positionY ); //pakeiciam konteksto asi i paveiksliuko centra (veikia su linijom)
                //ctx.translate( positionX-width/2, positionY+height/2 ); //pakeiciam konteksto asi i paveiksliuko centra
                ctx.rotate(rotation * Math.PI / 180);
                ctx.drawImage(img, -width/2, -height/2, width, height);
                ctx.translate(-(positionX), -(positionY)); //atstatom konteksto asi i (0,0) (veikia su linijom)
                //ctx.translate(-(positionX+width/2), -(positionY+height/2)); //atstatom konteksto asi i (0,0)
            }

            //draw all the images
            for(var i = 0; i <= lineStartingPossX.length; i++){
                drawLine(lineStartingPossX[i], lineStartingPossY[i], lineEndingPossX[i], lineEndingPossY[i], lineColors[i], lineWidths[i]);
            }

            loadImage("turtle", canvasx, canvasy, turtleRots, 45, 60);

        }

    })();
}
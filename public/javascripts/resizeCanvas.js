/**
 * Created by pauliuslegeckas on 22/03/2017.
 */
document.addEventListener('DOMContentLoaded',domloaded,false);
function domloaded(){


    function resize_canvas(){
    }
    canvas = document.getElementById("drawingCanvas");
    if (canvas.width  < window.innerWidth) {
        canvas.width  = window.innerWidth;
    }

    if (canvas.height < window.innerHeight) {
        canvas.height = window.innerHeight;
    }
}
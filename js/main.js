var canvas,ctx;
var mouseX,mouseY,mouseDown=0;
var touchX,touchY;

// fucnction for interacting with canvas

function init()
{
    canvas = document.getElementById('sketchpad');
    //'2d' means two dimensional rendering context on canvas
    ctx = canvas.getContext('2d');
    //we have context of canvas on ctx
    //we will fill ctx background with black
    ctx.fillStyle = "black";
    // it draws a fill rect with x=0,y=0 as start 
    //and canvas width and height
    ctx.fillRect(0,0,canvas.width,canvas.height);
    if(ctx)
    {
        //if mousedown than call function 
        //sketchPad_mouseDown.false means bubble phase
        canvas.addEventListener('mousedown', sketchpad_mouseDown, false);          
        canvas.addEventListener('mousemove', sketchpad_mouseMove, false);          
        window.addEventListener('mouseup', sketchpad_mouseUp, false);           
        canvas.addEventListener('touchstart', sketchpad_touchStart,false);
        canvas.addEventListener('touchmove', sketchpad_touchMove, false); 
    }
}

//now to enable drawing on canvas we define draw function
function draw(ctx,x,y,size,isDown)
{
    if(isDown)
    {   //to inform canvas user is about to draw
        ctx.beginPath();
        //to set color of line
        ctx.strokeStyle = "white";
        //set width of line      
        ctx.lineWidth = '15'; 
        //.linejoin : set connection between two line 
        //lineCap to set end of line      
        ctx.lineJoin = ctx.lineCap = 'round';   
        //it tells where to start drawing line  
        ctx.moveTo(lastX, lastY);      
        //draw line from start to current position of pointer
        ctx.lineTo(x,y);
        //drawing is complete      
        ctx.closePath();   
        //to paint the line drawn with some pixel   
        ctx.stroke();    
    }   
   //if not mousedown than start posi is curr position  
  lastX = x; 
  lastY = y; 
}


//Event handlers

//when mouse is down it will call draw function
function sketchpad_mouseDown() {
    mouseDown=1;    
    draw(ctx,mouseX,mouseY,12, false );
}

//when mouse is released it set's mousedown back to false
function sketchpad_mouseUp() {    
    mouseDown=0;
}

//it is activated when mouse is moved in either direction
//it get's current position of mouse from getMousePos(e)
//if mouseDown than call draw
function sketchpad_mouseMove(e) {
    getMousePos(e);
    if (mouseDown==1) {
        draw(ctx,mouseX,mouseY,12, true);
    }
}

//it finds current position of pointer
//when mouse event is triggered
//offset x,offset y return x,y cordinate of mouse
//layer x,layer y 
//return horizantak and vertical cordinates relative to current layer
function getMousePos(e) 
{    
    if (!e)        
      var e = event;     
    if (e.offsetX) {        
      mouseX = e.offsetX;        
      mouseY = e.offsetY;    
    }    
    else if (e.layerX) {        
      mouseX = e.layerX;        
      mouseY = e.layerY;    
    } 
}

//touch event handler

//it is activated when user touches the touchpad
//it calls draw func with false to note position not to draw
function sketchpad_touchStart() {     
    getTouchPos();    
    draw(ctx,touchX,touchY,12, false);    
    //this prevents scrolling of screen when user draws
    event.preventDefault();
}


//it is activated when user drags in sketchpad
//it calls draw with true flag to enable drawing

function sketchpad_touchMove(e) {     
    getTouchPos(e);    
    draw(ctx,touchX,touchY,12, true);    
    event.preventDefault();
}

//it is used to find point in the sketchpad where user has
//touched

function getTouchPos(e) {    
    if (!e)        
    var e = event;     
    if(e.touches) {   
        //it length is used to find  
        //how many fingers has touched    
      if (e.touches.length == 1) {            
        var touch = e.touches[0];            
        touchX=touch.pageX-touch.target.offsetLeft;               
        touchY=touch.pageY-touch.target.offsetTop;        
      }
    }
}

//clearing the sketchpad
//on click of clear button it fills backg with black color

document.getElementById('clear_button').addEventListener("click",  
                                             function(){  
    ctx.clearRect(0, 0, canvas.width, canvas.height);  
    ctx.fillStyle = "black"; 
    ctx.fillRect(0, 0, canvas.width, canvas.height);
});







var base_url = window.location.origin;
let model;
(async function(){  
    console.log("model loading..."); 
	

    //model = await tf.loadLayersModel('C://Users//AVISHKAR//3D Objects//nf//models//model.json')
	//model = await tf.loadLayersModel("https://github.com/newtoprogramming9/test/blob/main/model.json")
	model = await tf.loadLayersModel("https://newtoprogramming9.github.io/test/blob/main/models/model.json")
    //model = await tf.loadLayersModel("https://maneprajakta.github.io/Digit_Recognition_Web_App/models/model.json")
    console.log("model loaded..");
})();



function preprocessCanvas(image) { 
   
    
    let tensor = tf.browser.fromPixels(image).resizeNearestNeighbor([28, 28]).mean(2).expandDims(2).expandDims().toFloat(); 
    console.log(tensor.shape); 
    return tensor.div(255.0);
}


document.getElementById('predict_button').addEventListener("click",async function(){     
    var imageData = canvas.toDataURL();    
    let tensor = preprocessCanvas(canvas); 
    console.log(tensor)   
    let predictions = await model.predict(tensor).data();  
    console.log(predictions)  
    let results = Array.from(predictions);    
    displayLabel(results);    
    console.log(results);
});



function displayLabel(data) { 
    var max = data[0];    
    var maxIndex = 0;     
    for (var i = 1; i < data.length; i++) {        
      if (data[i] > max) {            
        maxIndex = i;            
        max = data[i];        
      }
    }
document.getElementById('result').innerHTML = maxIndex;  
document.getElementById('confidence').innerHTML = "Confidence: "+(max*100).toFixed(2) + "%";
}

const { fromEvent, map } = require("rxjs");

const canvas = document.getElementById("reactive-canvas");

const cursorPosition = { x: 0, y: 0 };

const onMouseDown$ = fromEvent(canvas, "mousedown").pipe(
  map((event) => {
    cursorPosition.x = event.clientX - canvas.offsetLeft;
    cursorPosition.y = event.clientY - canvas.offsetTop;
    console.log(cursorPosition);
  })
);

const onMouseMove$ = fromEvent(canvas, "mousemove").pipe(
  map((event) => {
    console.log(event);
  })
);

const onMouseUp$ = fromEvent(canvas, "mouseup").pipe(
  map((event) => {
    console.log(event);
  })
);

onMouseDown$.subscribe();

const canvasContext = canvas.getContext("2d");
canvasContext.lineWidth = 7;
canvasContext.strokeStyle = "white";

canvasContext.beginPath();
canvasContext.moveTo(0, 0);
canvasContext.lineTo(100, 100);
canvasContext.stroke();
canvasContext.closePath();

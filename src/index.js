const { fromEvent, map, mergeAll, takeUntil, merge } = require("rxjs");

const canvas = document.getElementById("reactive-canvas");
const restartButton = document.getElementById("restart-button");

const cursorPosition = { x: 0, y: 0 };

const updateCursorPosition = (event) => {
  cursorPosition.x = event.clientX - canvas.offsetLeft;
  cursorPosition.y = event.clientY - canvas.offsetTop;
};

const onMouseDown$ = fromEvent(canvas, "mousedown");
onMouseDown$.subscribe(updateCursorPosition);
const onMouseUp$ = fromEvent(canvas, "mouseup");
const onMouseMove$ = fromEvent(canvas, "mousemove").pipe(takeUntil(onMouseUp$));

let onMouseDownSubscription = onMouseDown$.subscribe();

const canvasContext = canvas.getContext("2d");
canvasContext.lineWidth = 8;
canvasContext.lineJoin = "round";
canvasContext.lineCap = " round";
canvasContext.strokeStyle = "white";

const paintStroke = (event) => {
  canvasContext.beginPath();
  canvasContext.moveTo(cursorPosition.x, cursorPosition.y);
  updateCursorPosition(event);
  canvasContext.lineTo(cursorPosition.x, cursorPosition.y);
  canvasContext.stroke();
  canvasContext.closePath();
};

const startPaint$ = onMouseDown$.pipe(
  map(() => onMouseMove$),
  mergeAll()
);

let startPaintSubscription = startPaint$.subscribe(paintStroke);

const onLoadWindow$ = fromEvent(window, " load");
const onRestartButton$ = fromEvent(restartButton, "click");

const restartWhiteBoard$ = merge(onLoadWindow$, onRestartButton$);

restartWhiteBoard$.subscribe(() => {
  startPaintSubscription.unsubscribe();
  onMouseDownSubscription.unsubscribe();
  canvasContext.clearRect(0, 0, canvas.width, canvas.height);
  startPaintSubscription = startPaint$.subscribe(paintStroke);
  onMouseDownSubscription = onMouseDown$.subscribe();
});

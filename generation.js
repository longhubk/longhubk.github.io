let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");

let cameraOffset = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
let cameraZoom = 1;
let MAX_ZOOM = 5;
let MIN_ZOOM = 0.1;
let SCROLL_SENSITIVITY = 0.0005;

class Box {
  height = 100;
  width = 100;
  color = "#118811";
  constructor(x, y, name) {
    this.x = x;
    this.y = y;
    this.name = name;
  }
  draw() {
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.width, this.height);
    ctx.fillStyle = "#000";
    drawText(this.name, this.x, this.y + 10, 10, "courier");
  }
}

class ArrowVer {
  constructor(fromBox, arrow) {
    this.fromBox = fromBox;
    this.arrow = arrow;
  }

  draw() {
    ctx.fillStyle = "#f00";
    ctx.beginPath();
    ctx.moveTo(
      (this.fromBox.x + this.fromBox.x + this.fromBox.width) / 2,
      this.fromBox.y
    );
    ctx.lineTo(
      (this.arrow.fromBox.x +
        this.arrow.fromBox.width / 2 +
        (this.arrow.toBox.x + this.arrow.toBox.x + this.arrow.toBox.width) /
          2) /
        2,
      this.arrow.fromBox.y + this.arrow.fromBox.height + 20
    );
    ctx.stroke();
  }
}

class ArrowHor {
  constructor(fromBox, toBox) {
    this.fromBox = fromBox;
    this.toBox = toBox;
  }

  draw() {
    ctx.fillStyle = "#f00";
    ctx.beginPath();
    ctx.moveTo(
      this.fromBox.x + this.fromBox.width / 2,
      this.fromBox.y + this.fromBox.height
    );
    ctx.lineTo(
      this.fromBox.x + this.fromBox.width / 2,
      this.fromBox.y + this.fromBox.height + 20
    );
    ctx.lineTo(
      (this.toBox.x + this.toBox.x + this.toBox.width) / 2,
      this.fromBox.y + this.fromBox.height + 20
    );
    ctx.lineTo(
      this.toBox.x + this.toBox.width / 2,
      this.toBox.y + this.toBox.height
    );
    ctx.stroke();
  }
}
// function drawArrow(box, box, name) {}
const family = {
  far: {
    name: "Nguyen Van Luong",
    old: 48,
    gen: "male",
  },
  mom: {
    name: "Nguyen Thi Canh",
    old: 45,
    gen: "female",
  },
  children: [
    {
      name: "Nguyen Thanh Long",
      old: 24,
      gen: "male",
    },
    {
      name: "Nguyen Cam Ly",
      old: 12,
      gen: "female",
    },
  ],
};

class Family {
  constructor(data, firstPoint = { x: -50, y: -50 }) {
    this.data = data;
    this.firstPoint = firstPoint;
  }
  draw() {
    const box1 = new Box(
      this.firstPoint.x,
      this.firstPoint.y,
      this.data.far.name
    );
    const box4 = new Box(
      this.firstPoint.x + box1.width * 1.5,
      this.firstPoint.y,
      this.data.mom.name
    );

    const arrow14 = new ArrowHor(box1, box4);
    box1.draw();
    box4.draw();
    arrow14.draw();
    for (let i = 0; i < this.data.children.length; i++) {
      const box2 = new Box(
        this.firstPoint.x - box1.width + i * 200,
        this.firstPoint.y - box1.y * 3,
        this.data.children[i].name
      );
      const arrow12 = new ArrowVer(box2, arrow14);
      box2.draw();
      arrow12.draw();
    }
  }
}

const family1 = new Family(family);

function draw() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  ctx.fillStyle = "#FFFFE0";
  drawRect(0, 0, canvas.width, canvas.height);

  // Translate to the canvas centre before zooming - so you'll always zoom on what you're looking directly at
  ctx.translate(window.innerWidth / 2, window.innerHeight / 2);
  ctx.scale(cameraZoom, cameraZoom);
  ctx.translate(
    -window.innerWidth / 2 + cameraOffset.x,
    -window.innerHeight / 2 + cameraOffset.y
  );

  family1.draw();
  // ctx.clearRect(0,0, window.innerWidth, window.innerHeight)
  // ctx.fillStyle = "#118811"

  // ctx.drawLine(0,0, 50, 50);

  // ctx.fillStyle = "#eecc77"
  // drawRect(,100,100);
  // drawRect(-35,-35,20,20)
  // drawRect(15,-35,20,20)
  // drawRect(-35,15,70,20)

  // ctx.fillStyle = "#fff"
  // drawText("Simple Pan and Zoom Canvas", -255, -100, 32, "courier")

  // ctx.rotate(-31*Math.PI / 180)
  // ctx.fillStyle = `#${(Math.round(Date.now()/40)%4096).toString(16)}`

  // ctx.fillStyle = "#fff"
  // ctx.rotate(31*Math.PI / 180)

  // drawText("Wow, you found me!", -260, -2000, 48, "courier")

  requestAnimationFrame(draw);
}

// Gets the relevant location from a mouse or single touch event
function getEventLocation(e) {
  if (e.touches && e.touches.length == 1) {
    return { x: e.touches[0].clientX, y: e.touches[0].clientY };
  } else if (e.clientX && e.clientY) {
    return { x: e.clientX, y: e.clientY };
  }
}

function drawRect(x, y, width, height) {
  ctx.fillRect(x, y, width, height);
}

function drawText(text, x, y, size, font) {
  ctx.font = `${size}px ${font}`;
  ctx.fillText(text, x, y);
}

let isDragging = false;
let dragStart = { x: 0, y: 0 };

function onPointerDown(e) {
  isDragging = true;
  dragStart.x = getEventLocation(e).x / cameraZoom - cameraOffset.x;
  dragStart.y = getEventLocation(e).y / cameraZoom - cameraOffset.y;
}

function onPointerUp(e) {
  isDragging = false;
  initialPinchDistance = null;
  lastZoom = cameraZoom;
}

function onPointerMove(e) {
  if (isDragging) {
    cameraOffset.x = getEventLocation(e).x / cameraZoom - dragStart.x;
    cameraOffset.y = getEventLocation(e).y / cameraZoom - dragStart.y;
  }
}

function handleTouch(e, singleTouchHandler) {
  if (e.touches.length == 1) {
    singleTouchHandler(e);
  } else if (e.type == "touchmove" && e.touches.length == 2) {
    isDragging = false;
    handlePinch(e);
  }
}

let initialPinchDistance = null;
let lastZoom = cameraZoom;

function handlePinch(e) {
  e.preventDefault();

  let touch1 = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  let touch2 = { x: e.touches[1].clientX, y: e.touches[1].clientY };

  // This is distance squared, but no need for an expensive sqrt as it's only used in ratio
  let currentDistance = (touch1.x - touch2.x) ** 2 + (touch1.y - touch2.y) ** 2;

  if (initialPinchDistance == null) {
    initialPinchDistance = currentDistance;
  } else {
    adjustZoom(null, currentDistance / initialPinchDistance);
  }
}

function adjustZoom(zoomAmount, zoomFactor) {
  if (!isDragging) {
    if (zoomAmount) {
      cameraZoom += zoomAmount;
    } else if (zoomFactor) {
      console.log(zoomFactor);
      cameraZoom = zoomFactor * lastZoom;
    }

    cameraZoom = Math.min(cameraZoom, MAX_ZOOM);
    cameraZoom = Math.max(cameraZoom, MIN_ZOOM);

    console.log(zoomAmount);
  }
}

canvas.addEventListener("mousedown", onPointerDown);
canvas.addEventListener("touchstart", (e) => handleTouch(e, onPointerDown));
canvas.addEventListener("mouseup", onPointerUp);
canvas.addEventListener("touchend", (e) => handleTouch(e, onPointerUp));
canvas.addEventListener("mousemove", onPointerMove);
canvas.addEventListener("touchmove", (e) => handleTouch(e, onPointerMove));
canvas.addEventListener("wheel", (e) =>
  adjustZoom(e.deltaY * SCROLL_SENSITIVITY)
);

// Ready, set, go
draw();

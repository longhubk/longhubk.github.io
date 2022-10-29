var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");

var ballRadius = 10;
var x = canvas.width / 2;
var y = canvas.height - 30;

var points = [];

var food = {
  x: canvas.width / 2,
  y: canvas.height / 2,
};

function initPoint() {
  points = [];
  for (var i = 0; i < 1; i++) {
    points.push({ x: x + 5, y: y });
  }
}

var score = 0;
var lives = 3;
var colorCode = "#008744";

document.addEventListener("mousemove", mouseMoveHandler, false);

function mouseMoveHandler(e) {
  x = e.clientX;
  y = e.clientY;
}

function drawOnePoint(idx, x = undefined, y = undefined) {
  ctx.beginPath();
  ctx.arc(
    x ? x : points[idx].x,
    y ? y : points[idx].y,
    ballRadius,
    0,
    Math.PI * 2
  );
  ctx.fillStyle = colorCode;
  ctx.fill();
  ctx.closePath();
  if (idx !== undefined) {
    ctx.font = "9px Arial";
    ctx.fillStyle = "#FFF";
    ctx.fillText(idx, points[idx].x - 5, points[idx].y + 2);
  }
}

function updatePoints() {
  const next = getNextPoint(points[0].x, points[0].y, x, y, 2 * ballRadius);
  if (next.x !== points[0].x || next.y !== points[0].y) {
    points[0].x = next.x;
    points[0].y = next.y;
    for (var idx = points.length - 1; idx > 0; idx--) {
      points[idx].x = points[idx - 1].x;
      points[idx].y = points[idx - 1].y;
    }
  }
}

function calDistanceTwoPoint(point1, point2) {
  const delta1 = Math.pow(point2.x - point1.x, 2);
  const delta2 = Math.pow(point2.y - point1.y, 2);
  const res = Math.sqrt(delta1 + delta2);
  return res;
}

function resolveEquation(a, b, c) {
  var x1 = null;
  var x2 = null;
  var d = b * b - 4 * a * c;
  if (a == 0) {
    if (b == 0) {
      if (c == 0) {
        console.log("All are solutions of x");
      } else {
        console.log(`Can't solve for x`);
      }
    } else {
      x1 = -c / b;
    }
  } else if (d >= 0) {
    x1 = (-b + Math.sqrt(d)) / (2 * a);
    x2 = (-b - Math.sqrt(d)) / (2 * a);
  } else {
    console.log(`Can't solve`);
  }
  return { x1, x2 };
}

function getCoefficient(qA, qB, qC, xA, yA, r) {
  var a2 = Math.pow(qA, 2);
  var b2 = Math.pow(qB, 2);
  var temp = yA * qB + qC;
  var a = a2 + b2;
  var b = -2 * xA * b2 + 2 * temp * qA;
  var c = Math.pow(xA, 2) * b2 + Math.pow(temp, 2) - b2 * Math.pow(r, 2);
  return { a, b, c };
}

function getLinearEquation(point1, point2) {
  let a = 0;
  let b = 0;
  let c = 0;
  const directionVector = {
    x: point2.x - point1.x,
    y: point2.y - point1.y,
  };

  const normalVector = { x: -directionVector.y, y: directionVector.x };
  a = normalVector.x;
  b = normalVector.y;
  c = -(point1.x * normalVector.x + point1.y * normalVector.y);
  return { a, b, c };
}

function getAnotherCoordinate(a, b, c, x) {
  return (-c - a * x) / b;
}

function drawScore() {
  ctx.font = "16px Arial";
  ctx.fillStyle = colorCode;
  ctx.fillText("Score: " + score, 8, 20);
}

function drawLives() {
  ctx.font = "16px Arial";
  ctx.fillStyle = colorCode;
  ctx.fillText("Lives: " + lives, canvas.width - 65, 20);
}

function getNextPoint(xA, yA, xB, yB, r) {
  const leq = getLinearEquation({ x: xB, y: yB }, { x: xA, y: yA });
  const coe = getCoefficient(leq.a, leq.b, leq.c, xA, yA, r);
  const req = resolveEquation(coe.a, coe.b, coe.c);
  const ac1 = getAnotherCoordinate(leq.a, leq.b, leq.c, req.x1);
  const res1 = { x: req.x1, y: ac1 };
  const dis1 = calDistanceTwoPoint(res1, { x: xB, y: yB });
  const ac2 = getAnotherCoordinate(leq.a, leq.b, leq.c, req.x2);
  const res2 = { x: req.x2, y: ac2 };
  const dis2 = calDistanceTwoPoint(res2, { x: xB, y: yB });
  let nextPoint = dis1 < dis2 ? res1 : res2;
  if (nextPoint.x > canvas.width) {
    nextPoint.x = ballRadius;
    nextPoint.y = (-leq.c - ballRadius * leq.a) / leq.b;
  } else if (nextPoint.y > canvas.height) {
    nextPoint.y = ballRadius;
    nextPoint.x = (-leq.c - ballRadius * leq.b) / leq.a;
  }
  return nextPoint;
}

function randomRange(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  // if (lives < 0) {
  //   lives = 3;
  //   initPoint();
  // }
  for (var idx = points.length - 1; idx >= 0; idx--) {
    // // if (idx > 0) {
    // const dis = calDistanceTwoPoint(points[0], points[idx]);
    // console.log('dis2', dis);
    // if (dis < 2 * ballRadius) {
    //   console.log('minus live');
    //   lives = lives-1;
    // }
    // }
    drawOnePoint(idx);
  }
  const dis = calDistanceTwoPoint(points[0], food);
  if (dis < 2 * ballRadius) {
    score += 1;
    points.push({ x: -1, y: -1 });
    for (var idx = points.length - 1; idx > 0; idx--) {
      points[idx].x = points[idx - 1].x;
      points[idx].y = points[idx - 1].y;
    }
    points[0].x = food.x;
    points[0].y = food.y;

    food.x = randomRange(2 * ballRadius, canvas.width - 2 * ballRadius);
    food.y = randomRange(2 * ballRadius, canvas.height - 2 * ballRadius);
  }
  if (food.x !== null && food.y !== null) {
    drawOnePoint(undefined, food.x, food.y);
  }
  drawScore();
  drawLives();

  requestAnimationFrame(draw);
}

initPoint();
draw();
setInterval(() => {
  updatePoints();
}, 500);

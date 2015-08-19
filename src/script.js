/*

  Classes or entities?

 */
var WORLD = {
  gravity: -1000,
  width: 1280.0,
  height: 800.0,
  phase: 1,
  base: 800.0
};

var GameObject = function(xPosition, yPosition, width, height, color, context) {
  this.xPosition = xPosition;
  this.yPosition = yPosition;
  this.width = width;
  this.height = height;
  this.color = color;
  this.ctx = context;
  this.moveLeft = false;
  this.moveUp = false;
  this.moveRight = false;
  this.moveDown = false;

  this.draw = function() {
    ctx.save();
    ctx.translate(-this.width/2, -this.height/2);
    ctx.beginPath();
    ctx.rect(this.xPosition, this.yPosition, this.width, this.height);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.closePath();
    ctx.restore();
  };
};

var Character = function(xPosition, yPosition, width, height, color, context) {
  GameObject.call(this, xPosition, yPosition, width, height, color, context);
  this.jump = false;
  this.jumpSpeed = -WORLD.height;
  this.jumpMomentum = 0;
  this.gravity = WORLD.gravity;
};

Character.prototype = Object.create(GameObject.prototype);
Character.prototype.constructor = Character;

var Platform = function(xPosition, yPosition, width, height, color, context) {
  GameObject.call(this, xPosition, yPosition, width, height, color, context);
};

Platform.prototype = Object.create(GameObject.prototype);
Platform.prototype.constructor = Platform;

/*

  Canvas

 */

var canvas = document.getElementById('myCanvas');
var ctx = canvas.getContext('2d');


function setDimensions() {
  var rw, rh, r;
  rw = window.innerWidth / WORLD.width;
  rh = window.innerHeight / WORLD.height;
  r = Math.min(rw, rh);

  canvas.height = WORLD.height * r;
  canvas.width = WORLD.width * r;

  canvas.style.marginTop = rw <= rh ? String((window.innerHeight - canvas.height) / 2) + 'px' : 0;

  ctx.scale(canvas.width / WORLD.width, canvas.height / WORLD.height);

}

setDimensions();

window.onresize = setDimensions;

var player = new Character(WORLD.width/ 2, WORLD.height - 50, 10, 20,'#0095DD', ctx);
var player2 = new Character(WORLD.width/ 2, WORLD.height / 2, 10, 20,'#000000', ctx);
var platform = new Platform(50, 50, 50, 10,'#0095DD', ctx);

/*
  
  Controller

 */

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

function keyDownHandler(e) {
  if(e.keyCode == 37) {
    player.moveLeft = true;
  }
  else if(e.keyCode == 38) {
    player.moveUp = true;
  }
  else if(e.keyCode == 39) {
    player.moveRight = true;
  }
  else if(e.keyCode == 40) {
    player.moveDown = true;
  }
  // hitting space 
  else if(e.keyCode == 32) {
    console.log("jump");
    player.jumpMomentum = player.jumpSpeed;
  }
  // hit R for reverse
  else if(e.keyCode == 82) {
    reverse();
  }
}

function keyUpHandler(e) {
  if(e.keyCode == 37) {
    player.moveLeft = false;
  }
  if(e.keyCode == 38) {
    player.moveUp = false;
  }
  if(e.keyCode == 39) {
    player.moveRight = false;
  }
  if(e.keyCode == 40) {
    player.moveDown = false;
  }
}

/*

  Render/update/draw

 */

function reverse() {
  WORLD.phase = -WORLD.phase;
  // WORLD.base = WORLD.phase === -1 ? 0 : WORLD.height;
  WORLD.gravity = -WORLD.gravity;
}

function update(dt) {
  updatePlayer(dt);
}

function updatePlayer(dt) {

  if (player.moveLeft) {
    player.xPosition -= (150 * dt);
  }
  if (player.moveUp) {
    player.yPosition -= (150 * dt);
  }
  if (player.moveRight) {
    player.xPosition += (150 * dt);
  }
  if (player.moveDown) {
    player.yPosition += (150 * dt);
  }

  player.yPosition += Math.min((player.jumpMomentum * dt), WORLD.base - player.yPosition - player.height / 2);
  player.jumpMomentum = !(WORLD.base - player.yPosition - player.height / 2) ? 0 : player.jumpMomentum - (WORLD.gravity * dt);

  player2.yPosition = player.yPosition * -1 + WORLD.height;
  player2.xPosition = player.xPosition * -1 + WORLD.width;

  console.log('jumpMomentum: ', player.jumpMomentum);

}

function render() {
  player.draw();
  player2.draw();
  platform.draw();
}

var lastTime;

function draw() {
  var now = Date.now();
  var dt = (now - lastTime) / 1000.0;

  ctx.clearRect(0, 0, WORLD.width, WORLD.height);

  update(dt);
  render();

  lastTime = now;
  requestAnimationFrame(draw);
}

function init() {
    lastTime = Date.now();
    draw();
}

init();

// var canvas = document.getElementById('myCanvas');
//   var ctx = canvas.getContext('2d');

//   var x = WORLD.width/ 2;
//   var y = WORLD.height - 30;

//   var dx = 2;
//   var dy = -2;

//   var ballRadius = 10;
//   var ballColor = "#0095DD";

//   var paddleHeight = 10;
//   var paddleWidth = 75;
//   var paddleX = (WORLD.width- paddleWidth) / 2;
//   var paddleColor = "#0095DD";

//   var rightPressed = false;
//   var leftPressed = false;

//   var brickRowCount = 5;
//   var brickColumnCount = 3;
//   var brickWidth = 75;
//   var brickHeight = 20;
//   var brickPadding = 10;
//   var brickOffsetTop = 30;
//   var brickOffsetLeft = 30;

//   var bricks = [];
//   for(c=0; c<brickColumnCount; c++) {
//       bricks[c] = [];
//       for(r=0; r<brickRowCount; r++) {
//           bricks[c][r] = { x: 0, y: 0, status: 1};
//       }
//   }

//   var score = 0;
//   var lives = 3;

//   document.addEventListener("keydown", keyDownHandler, false);
//   document.addEventListener("keyup", keyUpHandler, false);
//   document.addEventListener("mousemove", mouseMoveHandler, false);


//   function drawScore() {
//       ctx.font = "16px Arial";
//       ctx.fillStyle = "#0095DD";
//       ctx.fillText("Score: "+score, 8, 20);
//   }

//   function drawLives() {
//       ctx.font = "16px Arial";
//       ctx.fillStyle = "#0095DD";
//       ctx.fillText("Lives: "+lives, canvas.width-65, 20);
//   }

//   function keyDownHandler(e) {
//     if(e.keyCode == 39) {
//         rightPressed = true;
//     }
//     else if(e.keyCode == 37) {
//         leftPressed = true;
//     }
//   }

//   function keyUpHandler(e) {
//     if(e.keyCode == 39) {
//         rightPressed = false;
//     }
//     else if(e.keyCode == 37) {
//         leftPressed = false;
//     }
//   }

//   function mouseMoveHandler(e) {
//     var relativeX = e.clientX - canvas.offsetLeft;
//     if(relativeX > 0 && relativeX < canvas.width) {
//         paddleX = relativeX - paddleWidth/2;
//     }
//   }

//   function collisionDetection() {
//       for(c=0; c<brickColumnCount; c++) {
//           for(r=0; r<brickRowCount; r++) {
//               var b = bricks[c][r];
//               if(b.status == 1) {
//                   if(x > b.x && x < b.x+brickWidth && y > b.y && y < b.y+brickHeight) {
//                       dy = -dy;
//                       b.status = 0;
//                       score++;
//                       if(score == brickRowCount*brickColumnCount) {
//                           alert("YOU WIN, CONGRATULATIONS!");
//                           document.location.reload();
//                       }
//                   }
//               }
//           }
//       }
//   }

//   function drawBall() {
//     ctx.beginPath();
//     ctx.arc(x, y, ballRadius, 0, Math.PI*2);
//     ctx.fillStyle = ballColor;
//     ctx.fill();
//     ctx.closePath();
//   }

//   function drawPaddle() {
//     ctx.beginPath();
//     ctx.rect(paddleX, WORLD.height - paddleHeight, paddleWidth, paddleHeight);
//     ctx.fillStyle = paddleColor;
//     ctx.fill();
//     ctx.closePath();
//   }

//   function drawBricks() {
//       for(c=0; c<brickColumnCount; c++) {
//           for(r=0; r<brickRowCount; r++) {
//               if(bricks[c][r].status == 1){
//                   var brickX = (r*(brickWidth+brickPadding))+brickOffsetLeft;
//                   var brickY = (c*(brickHeight+brickPadding))+brickOffsetTop;
//                   bricks[c][r].x = brickX;
//                   bricks[c][r].y = brickY;
//                   ctx.beginPath();
//                   ctx.rect(brickX, brickY, brickWidth, brickHeight);
//                   ctx.fillStyle = "#0095DD";
//                   ctx.fill();
//                   ctx.closePath();
//               }
//           }
//       }
//   }

//   function draw() {
//     ctx.clearRect(0, 0, canvas.width, WORLD.height);
//     drawBricks();
//     drawBall();
//     drawPaddle();
//     collisionDetection();
//     drawScore();
//     drawLives();
//     x += dx;
//     y += dy;

//     if(x + dx < ballRadius) {
//         dx = -dx;
//         ballColor = getRandomColor();
//     } else if(x + dx > canvas.width-ballRadius) {
//         dx = -dx;
//         ballColor = getRandomColor()
//     }

//     if(y + dy < ballRadius) {
//         dy = -dy;
//     } else if(y + dy > WORLD.height-ballRadius) {
//         if(x > paddleX && x < paddleX + paddleWidth) {
//             dy = -dy;
//         }
//         else {
//           lives--;
//           if(!lives) {
//               alert("GAME OVER");
//               document.location.reload();
//           }
//           else {
//               x = canvas.width/2;
//               y = WORLD.height-30;
//               dx = 2;
//               dy = -2;
//               paddleX = (canvas.width-paddleWidth)/2;
//           }
//         }
//     }

//     if(rightPressed && paddleX < canvas.width-paddleWidth) {
//         paddleX += 7;
//     }
//     else if(leftPressed && paddleX > 0) {
//         paddleX -= 7;
//     }
//     requestAnimationFrame(draw);
//   }

//   draw();

//   function getRandomColor() {
//     var letters = '0123456789ABCDEF'.split('');
//     var color = '#';
//     for (var i = 0; i < 6; i++ ) {
//         color += letters[Math.floor(Math.random() * 16)];
//     }
//     return color;
// }
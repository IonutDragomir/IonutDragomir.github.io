let snakeSpeed = 7;
let lastTimeRegistered = 0;
let unique = 3;
let snakeBody = [
  { row: 5, column: 5 },
  { row: 5, column: 6 },
  { row: 5, column: 7 },
];
let directionOfTheMovingSnake = "right1";
let appleWasEat = false;
let callRepaintWindow;
let deadSnake = 0;

function start(curentTime) {
  callRepaintWindow = window.requestAnimationFrame(start);
  window.addEventListener("keydown", checkKey, false);
  let secondsSinceLastRender = (curentTime - lastTimeRegistered) / 1000;
  if (secondsSinceLastRender < 1 / snakeSpeed) {
    return;
  }
  lastTimeRegistered = curentTime;
  document.getElementById("grid").innerHTML = `<img src="/snakeJS/terrain.png">`;
  drawSnake();
  if (appleWasEat) {
    createFood();
    appleWasEat = false;
  }
  document.getElementById("grid").innerHTML += `<img
    src="https://img.icons8.com/external-kiranshastry-lineal-color-kiranshastry/64/000000/external-apple-fruits-and-vegetables-kiranshastry-lineal-color-kiranshastry.png"
    id="apple"/>`;
  document.getElementById("apple").style.gridRowStart = food.x;
  document.getElementById("apple").style.gridColumnStart = food.y;
}

function checkKey(key) {
  if (
    key.keyCode == "37" &&
    directionOfTheMovingSnake != "right" &&
    directionOfTheMovingSnake != "right1"
  ) {
    //arrow left;
    directionOfTheMovingSnake = "left";
  }
  if (key.keyCode == "38" && directionOfTheMovingSnake != "down") {
    //arrow up
    directionOfTheMovingSnake = "up";
  }
  if (key.keyCode == "39" && directionOfTheMovingSnake != "left") {
    //arrow right
    directionOfTheMovingSnake = "right";
  }
  if (key.keyCode == "40" && directionOfTheMovingSnake != "up") {
    //arrow down
    directionOfTheMovingSnake = "down";
  }
  return key.keyCode;
}

// if (directionOfTheMovingSnake == "right" && i == snakeBody.length - 1) {

function drawSnake() {
  for (let i = snakeBody.length - 1; i >= 0; --i) {
    if (directionOfTheMovingSnake == "right" && i == snakeBody.length - 1) {
      //right
      if (checkBox({ x: snakeBody[i].row, y: snakeBody[i].column + 1 }) == 1) {
        stop();
      }
      // growBody("right");

      snakeBody.push({
        row: snakeBody[i].row,
        column: snakeBody[i].column + 1,
      });
      if (snakeBody[snakeBody.length - 1].column == 24) {
        stop();
      }
      i = lastBox(i);
    } else if (
      directionOfTheMovingSnake == "left" &&
      i == snakeBody.length - 1
    ) {
      //left
      if (checkBox({ x: snakeBody[i].row, y: snakeBody[i].column - 1 }) == 1) {
        stop();
      }
      snakeBody.push({
        row: snakeBody[i].row,
        column: snakeBody[i].column - 1,
      });
      if (snakeBody[snakeBody.length - 1].column == 0) {
        stop();
      }
      i = lastBox(i);
    } else if (directionOfTheMovingSnake == "up" && i == snakeBody.length - 1) {
      //up
      if (checkBox({ x: snakeBody[i].row - 1, y: snakeBody[i].column }) == 1) {
        stop();
      }
      snakeBody.push({
        row: snakeBody[i].row - 1,
        column: snakeBody[i].column,
      });
      if (snakeBody[snakeBody.length - 1].row == 0) {
        stop();
      }
      i = lastBox(i);
    } else if (
      directionOfTheMovingSnake == "down" &&
      i == snakeBody.length - 1
    ) {
      //down
      if (checkBox({ x: snakeBody[i].row + 1, y: snakeBody[i].column }) == 1) {
        stop();
      }
      snakeBody.push({
        row: snakeBody[i].row + 1,
        column: snakeBody[i].column,
      });
      if (snakeBody[snakeBody.length - 1].row == 20) {
        stop();
      }
      i = lastBox(i);
    }

    // if(directionOfTheMovingSnake != "right1" && i == snakeBody.length - 1) {
    //   i = lastBox(i);
    // }
    console.log(snakeBody);
    document.getElementById(
      "grid"
    ).innerHTML += `<div class="box" id ="${unique}"></div>`;
    if (i == snakeBody.length - 1 || deadSnake == 1) {
      if (deadSnake == 0 || (deadSnake == 1 && i == snakeBody.length - 2)) {
        document.getElementById(unique).style.borderRadius = "50%";
        document.getElementById(unique).style.backgroundColor = "green";
      }
    }
    document.getElementById(unique).style.gridRowStart = snakeBody[i].row;
    document.getElementById(unique).style.gridColumnStart = snakeBody[i].column;
    ++unique;
  }
}

function lastBox(newHead) {
  if (deadSnake == 0) {
    if (
      snakeBody[newHead].row != food.x ||
      snakeBody[newHead].column != food.y
    ) {
      snakeBody.shift();
    } else {
      ++newHead;
      appleWasEat = true;
    }
  }
  return newHead;
}

let food = {
  x: 5,
  y: 18,
};

let numberOfEatedApples = 0;

function createFood() {
  ++numberOfEatedApples;
  document.getElementById("scoreNumber").innerHTML = `${numberOfEatedApples}`;
  food.x = Math.floor(Math.random() * 18) + 1;
  food.y = Math.floor(Math.random() * 21) + 2;
  if (checkBox({ x: food.x, y: food.y }) == 1) {
    createFood();
  }
}

function checkBox(position) {
  let ok = 0;
  for (let j = snakeBody.length - 1; j >= 0; --j) {
    if (position.x == snakeBody[j].row && position.y == snakeBody[j].column) {
      ok = 1;
    }
  }
  return ok;
}

function play() {
  location.reload();
}

function plusSpeed() {
  ++snakeSpeed;
}
function minusSpeed() {
  --snakeSpeed;
}

function stop() {
  window.cancelAnimationFrame(callRepaintWindow);
  deadSnake = 1;
  document.getElementById("lost").innerHTML += `
  <p class = "GameOver">Game Over</p>
  <img class="bang" src="/snakeJS/GameOver.png" alt="">`;
}

start();

//addition function
function growBody(direction) {
  snakeBody.push({
    row: snakeBody[snakeBody.length - 1].row,
    column: snakeBody[snakeBody.length - 1].column,
  });
  if (direction == "right") {
    snakeBody[snakeBody.length - 1].column + 1;
  } else if (direction == "left") {
    snakeBody[snakeBody.length - 1].column - 1;
  } else if (direction == "up") {
    snakeBody[snakeBody.length - 1].row - 1;
  } else if (direction == "down") {
    snakeBody[snakeBody.length - 1].row + 1;
  }
}

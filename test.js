let snakeSpeed = 7;
let lastTimeRegistered = 0;
let identifier = 3;
let direction = [
  { row: 5, column: 5 },
  { row: 5, column: 6 },
  { row: 5, column: 7 },
];
let arrayIndex = 0;
let josSauSusStangaDreapta = "right1";
let noBackwards;
let appleWasEat = 1;
console.log(direction[0].column);
let req;
let deadSnake = 0;

function snake(curentTime) {
  req = window.requestAnimationFrame(snake);
  window.addEventListener("keydown", checkKey, false);
  let secondsSinceLastRender = (curentTime - lastTimeRegistered) / 1000;
  if (secondsSinceLastRender < 1 / snakeSpeed) {
    return;
  }
  lastTimeRegistered = curentTime;
  //generam mereu tabla de joc. ajuta si ca sa nu mai apara coada sarpelui cand se misca
  document.getElementById(
    "grid"
  ).innerHTML = `<img src="/tabla.png" class ="grass">`;
  drawSnake();
  console.log(direction);
  //apare marul
  if (appleWasEat === 0) {
    createFood();
    appleWasEat = 1;
  }
  document.getElementById("grid").innerHTML += `<img
    src="https://img.icons8.com/external-kiranshastry-lineal-color-kiranshastry/64/000000/external-apple-fruits-and-vegetables-kiranshastry-lineal-color-kiranshastry.png"
    id="apple"/>`;
  document.getElementById("apple").style.gridRowStart = food.x;
  document.getElementById("apple").style.gridColumnStart = food.y;
}

function checkKey(key) {
  if (key.keyCode == "37") {
    //arrow left;

    //right1 sets the bigining of the game to not be  abel to go left at hte start
    if (
      josSauSusStangaDreapta != "right" &&
      josSauSusStangaDreapta != "right1"
    ) {
      josSauSusStangaDreapta = "left";
    }
  }

  if (key.keyCode == "38") {
    //arrow up
    if (josSauSusStangaDreapta != "down") {
      josSauSusStangaDreapta = "up";
    }
  }

  if (key.keyCode == "39") {
    //arrow right
    if (josSauSusStangaDreapta != "left") {
      josSauSusStangaDreapta = "right";
    }
  }

  if (key.keyCode == "40") {
    //arrow down
    if (josSauSusStangaDreapta != "up") {
      josSauSusStangaDreapta = "down";
    }
  }
}

// i == direction.length - 1 facem asta ca sa schimba pozitia doar primei patratele
function drawSnake() {
  for (let i = direction.length - 1; i >= 0; --i) {
    if (josSauSusStangaDreapta == "right" && i == direction.length - 1) {
      //right

      // daca sarpele urmeaza sa fie desenat pe o casuta care contine deja o parte din sarpe, orpim jocul, dar mai desenam odata tot sarpele
      //functia checkBox verifica daca urmatoarea pozitie este deja ocupata de sarpe sau poate inaita acolo
      //primeste ca parametru un obiect cu pozitia liniei si a coloanei poitiei care urmeaza
      if (checkBox({ x: direction[i].row, y: direction[i].column + 1 }) == 1) {
        stop();
      }

      direction.push({
        row: direction[i].row,
        column: direction[i].column + 1,
      });

      //daca sarpele a trecut limita tablei de joc, oprim jocul, dar mai desenam odata tot sarpele
      //fara sa actualizam/ desenez noua pozitie care a incalcat  limita tablei
      //asta se face din valoarea lui i din for care nu se actualizeaza cand se mareste sirul
      if (direction[direction.length - 1].column == 24) {
        stop();
      }

      if (deadSnake == 0) {
        if (direction[i].row != food.x || direction[i].column != food.y) {
          direction.shift();
        } else {
          ++i;
          appleWasEat = 0;
        }
      }
    } else if (josSauSusStangaDreapta == "left" && i == direction.length - 1) {
      //left
      if (checkBox({ x: direction[i].row, y: direction[i].column - 1 }) == 1) {
        stop();
      }
      direction.push({
        row: direction[i].row,
        column: direction[i].column - 1,
      });

      if (direction[direction.length - 1].column == 0) {
        stop();
      }

      if (deadSnake == 0) {
        if (direction[i].row != food.x || direction[i].column != food.y) {
          direction.shift();
        } else {
          ++i;
          appleWasEat = 0;
        }
      }
    } else if (josSauSusStangaDreapta == "up" && i == direction.length - 1) {
      //up

      if (checkBox({ x: direction[i].row - 1, y: direction[i].column }) == 1) {
        stop();
      }

      direction.push({
        row: direction[i].row - 1,
        column: direction[i].column,
      });
      if (direction[direction.length - 1].row == 0) {
        stop();
      }

      if (deadSnake == 0) {
        if (direction[i].row != food.x || direction[i].column != food.y) {
          direction.shift();
        } else {
          ++i;
          appleWasEat = 0;
        }
      }
    } else if (josSauSusStangaDreapta == "down" && i == direction.length - 1) {
      //down

      if (checkBox({ x: direction[i].row + 1, y: direction[i].column }) == 1) {
        stop();
      }

      direction.push({
        row: direction[i].row + 1,
        column: direction[i].column,
      });

      if (direction[direction.length - 1].row == 20) {
        stop();
      }

      if (deadSnake == 0) {
        if (direction[i].row != food.x || direction[i].column != food.y) {
          direction.shift();
        } else {
          ++i;
          appleWasEat = 0;
        }
      }
    }

    document.getElementById(
      "grid"
    ).innerHTML += `<div class="box" id ="${identifier}"></div>`;
    if (i == direction.length - 1 || deadSnake == 1) {
      if (deadSnake == 0 || (deadSnake == 1 && i == direction.length - 2)) {
        //daca sarpele nu e mort => deadSnake == 0 punem proprietatile astea pe capul sarpelui => i == direction.length - 1
        //daca sarpele a murit => deadSnake == 1 punem proprietatile astea pe urmatoarea pozitie dupa capul sarpelui => i == direction.length - 2
        document.getElementById(identifier).style.borderRadius = "50%";
        document.getElementById(identifier).style.backgroundColor = "green";
      }
    }
    document.getElementById(identifier).style.gridRowStart = direction[i].row;
    document.getElementById(identifier).style.gridColumnStart =
      direction[i].column;
    ++identifier;
  }
}

function plusSpeed() {
  ++snakeSpeed;
}
function minusSpeed() {
  --snakeSpeed;
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

  //verificam daca pozitia marului este o pozitie pe care se afla sarpele
  //daca este, mai apelam odata functia si facem asta pana cand marul nu este pe o pozitie in care se afla sarpele
  if (checkBox({ x: food.x, y: food.y }) == 1) {
    createFood();
  }
}

console.log(food.x, food.y);

function stop() {
  window.cancelAnimationFrame(req);
  deadSnake = 1; // il punem aici ca sa nu se repete inutuil dupa fiecare apelare a functiei stop
  document.getElementById("lost").innerHTML += `
  <p class = "GameOver">Game Over</p>
  <img class="bang" src="/pics/unnamed.png" alt="">`; // acelasi motiv ca mai sus
}

function checkBox(position) {
  let ok = 0;
  for (let j = direction.length - 1; j >= 0; --j) {
    if (position.x == direction[j].row && position.y == direction[j].column) {
      ok = 1;
    }
  }
  return ok;
}
snake();

function play() {
  location.reload();
}

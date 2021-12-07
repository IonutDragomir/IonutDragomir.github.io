let gameBoard = [];
let gameSize = 10;
let numberOfBombs = 10;
let bombCoordinates = [];
let bombsLeft = document.querySelector("[data-bombs-left]");
bombsLeft.textContent = numberOfBombs;

let statusTerrain = "terrain";
let statusDigged = "digged";
let statusBomb = "bomb";
let statusMarked = "marked";

function createBombCoordinates() {
  for (let i = 0; i < numberOfBombs; ++i) {
    let bombPosition = {
      x: Math.floor(Math.random() * 10),
      y: Math.floor(Math.random() * 10),
    };
    let length = bombCoordinates.length;
    let alreadyExist = false;
    while (length > 0) {
      if (
        bombPosition.x == bombCoordinates[length - 1].x &&
        bombPosition.y == bombCoordinates[length - 1].y
      ) {
        // setam ca exista deja bomba cu aceste coordonate
        alreadyExist = true;
      }
      --length;
    
    }
    if (!alreadyExist) {
      bombCoordinates.push(bombPosition);
    } else {
      //daca exista deja bomba cu aceste coordonate,
      // il scadem pe i ca sa se repete procesul pana cand avem un numar valid de bombe
      --i;
    }
  }
}

createBombCoordinates();

function creatGameBoard() {
  for (let i = 0; i < gameSize; ++i) {
    let row = [];
    for (let j = 0; j < gameSize; ++j) {
      row[j] = {
        element: document.createElement("div"),
        x: i,
        y: j,
        mine: checkMinePosition(i, j),
      };
      let element = row[j].element;
      element.dataset.status = statusTerrain;
    }
    gameBoard.push(row);
  }
}

function displaySquare() {
  creatGameBoard();
  for (let i = 0; i < gameSize; ++i) {
    for (let j = 0; j < gameSize; ++j) {
      document.getElementById("grid").appendChild(gameBoard[i][j].element);

      gameBoard[i][j].element.addEventListener("click", () => {
        digSquare(gameBoard, gameBoard[i][j]);
      });
      gameBoard[i][j].element.addEventListener("contextmenu", (elementJ) => {
        //prevenim mesaul cand apasam click dreapta
        elementJ.preventDefault();

        //marcam patratelele pe care le consideram bombe
        markSquare(gameBoard[i][j].element);
      });
    }
  }
}

displaySquare();

function checkMinePosition(positionX, positionY) {
  let index = bombCoordinates.length;
  while (index > 0) {
    if (positionX == bombCoordinates[index - 1].x && positionY == bombCoordinates[index - 1].y) {
      return true;
    }
    --index;
    if (index == 0) {
      return false;
    }
  }
}

function markSquare(element) {
  if (
    element.dataset.status != statusTerrain &&
    element.dataset.status != statusMarked
  ) {
    return;
  }

  if (element.dataset.status == statusMarked) {
    element.dataset.status = statusTerrain;
    ++bombsLeft.textContent;
  } else if (bombsLeft.textContent > 0) {
    // if ul ne ajuta sa nu marcam mai multe patratele decat avem bombe
    element.dataset.status = statusMarked;
    --bombsLeft.textContent;
  }
}

function digSquare(arrayOfSquares, square) {
  if (square.element.dataset.status != statusTerrain) {
    return;
  } else {
    square.element.dataset.status = statusDigged;

    let switcher = 0;
    for (let i = 0; i < 10; ++i) {
        for (let j = 0; j < 10; ++j) {
            if (arrayOfSquares[i][j].element.dataset.status == statusTerrain && arrayOfSquares[i][j].mine != true) {
                switcher = 1;
            }
        }
    }
    if (switcher == 0) {
        winOrLose("win");
    }
  }

  if (square.mine) {
    square.element.dataset.status = statusBomb;
    winOrLose("lost");
  }

  increaseClue(arrayOfSquares, square);
}

function increaseClue(arrayOfSquares, square) {
  //selectam toate patratelele adiacente patratelei pe care noi o apasam
  let adjacent = [];
  for (let topToBottom = square.x - 1; topToBottom <= square.x + 1; ++topToBottom) {
    for (let leftToRight = square.y - 1; leftToRight <= square.y + 1; ++leftToRight) {

      if (topToBottom >= 0 && topToBottom <= 9 && leftToRight >= 0 && leftToRight <= 9)
        adjacent.push(arrayOfSquares[topToBottom][leftToRight]);
    }
  }

  //verific in sirul adjacent daca sunt elemente cu mine true
  //daca sunt, cresc indiciul in functie de cate bombe sunt in matricea de 3X3 a patratului
  //pe care l am apasat
  let clue = 0;
  for (let index = 0; index < adjacent.length; ++index) {
    if (adjacent[index].mine) {
      ++clue;
    }
  }
  if (clue > 0 && square.element.dataset.status != statusBomb) {
    square.element.innerHTML = `<p class = "clue">${clue} </p>`;
  }
  if (clue == 0) {
    for (let index = 0; index < adjacent.length; ++index) {
      digSquare(arrayOfSquares, adjacent[index]);
    }
  }
}

function restart() {
  location.reload();
}


function winOrLose(endGame) {
    let div = document.createElement("div");
    div.classList.add("gameOver");
    document.querySelector("#grid").appendChild(div);

    if(endGame == "win") {
    document.getElementById("winLose").innerHTML += `<img src="/MineSweeper/you win.jpg" alt="">`;
    document.getElementById("winLose").innerHTML += `<img class="playButton" src="/MineSweeper/playButton.png" alt="" onclick="return restart();"></img>`;
        
    }
    if(endGame == "lost") {
        document.getElementById("winLose").innerHTML += `<img src="/MineSweeper/gameOver.jfif" alt="">`;
        document.getElementById("winLose").innerHTML += `<img class="playButton" src="/MineSweeper/playButton.png" alt="" onclick="return restart();"></img>`;
          
        for (let i = 0; i < 10; ++i) {
            for (let j = 0; j < 10; ++j) {
                if (gameBoard[i][j].mine) {
                  gameBoard[i][j].element.dataset.status = statusBomb;
                }
            }
        }
    }
}
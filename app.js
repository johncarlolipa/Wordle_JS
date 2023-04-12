const tileDisplay = document.querySelector(".tile-container");
const keyboard = document.querySelector(".key-container");
const messageDisplay = document.querySelector(".message-container");

let wordle;
const getWordle = () => {
  fetch("http://localhost:8000/word")
    .then((response) => response.json())
    .then((json) => {
      console.log(json);
      wordle = json.toUpperCase();
    })
    .catch((err) => console.log(err));
};

getWordle();

const keys = [
  "Q",
  "W",
  "E",
  "R",
  "T",
  "Y",
  "U",
  "I",
  "O",
  "P",
  "A",
  "S",
  "D",
  "F",
  "G",
  "H",
  "J",
  "K",
  "L",
  "ENTER",
  "Z",
  "X",
  "C",
  "V",
  "B",
  "N",
  "M",
  "«",
];

const guessRows = [
  ["", "", "", "", ""],
  ["", "", "", "", ""],
  ["", "", "", "", ""],
  ["", "", "", "", ""],
  ["", "", "", "", ""],
  ["", "", "", "", ""],
];

let currentRow = 0;
let currentTile = 0;
let isGameOver = false;

//create div guessrow and also guessrow-tile div
guessRows.forEach((guessRow, guessRowIndex) => {
  const rowElement = document.createElement("div");
  rowElement.setAttribute("id", "guessRow-" + guessRowIndex);
  guessRow.forEach((guess, guessIndex) => {
    const tileElement = document.createElement("div");
    tileElement.setAttribute(
      "id",
      "guessRow-" + guessRowIndex + "-tile-" + guessIndex
    );
    tileElement.classList.add("tile");
    rowElement.append(tileElement);
  });
  tileDisplay.append(rowElement);
});

//append keys to button
keys.forEach((key) => {
  const buttonElement = document.createElement("button");
  buttonElement.textContent = key;
  buttonElement.setAttribute("id", key);
  buttonElement.addEventListener("click", () => handleClick(key));
  keyboard.append(buttonElement);
});

//handlclick function; logging in the console the key that we click
const handleClick = (key) => {
  console.log("clicked", key);

  if (key === "«") {
    deleteKey();
    console.log("guessRows", guessRows);
    return;
  }
  if (key === "ENTER") {
    checkRow();
    console.log("guessRows", guessRows);
    return;
  }
  addKey(key);
  console.log("guessRows", guessRows);
};

//   each time we clicked a letter it is added to the correct tile

const addKey = (key) => {
  if (currentTile < 5 && currentRow < 6) {
    const tile = document.getElementById(
      "guessRow-" + currentRow + "-tile-" + currentTile
    );
    tile.textContent = key;
    guessRows[currentRow][currentTile] = key;
    tile.setAttribute("data", key);
    currentTile++;
  }
};

// function to delete key
const deleteKey = () => {
  if (currentTile > 0) {
    currentTile--;
    const tile = document.getElementById(
      "guessRow-" + currentRow + "-tile-" + currentTile
    );
    tile.textContent = "";
    guessRows[currentRow][currentTile] = "";
    tile.setAttribute("data", "");
  }
};

// enter key function
const checkRow = () => {
  const guess = guessRows[currentRow].join("");
  if (currentTile > 4) {
    console.log("guess is" + guess, "wordle is" + wordle);
    flipTile();
    if (wordle == guess) {
      showMessage("Perfect! You're doing great!");
      isGameOver = true;
      return;
    } else {
      if (currentRow >= 4) {
        isGameOver = false;
        showMessage("Game Over!");
        return;
      }
      if (currentRow < 5) {
        currentRow++;
        currentTile = 0;
      }
    }
  }
};

// showMessage function
const showMessage = (message) => {
  const messageElement = document.createElement("p");
  messageElement.textContent = message;
  messageDisplay.append(messageElement);
  setTimeout(() => messageDisplay.removeChild(messageElement), 4000);
};

// addColorToKey function
const addColorToKey = (keyLetter, color) => {
  const key = document.getElementById(keyLetter);
  key.classList.add(color);
};

// adding colors
const flipTile = () => {
  const rowTiles = document.querySelector("#guessRow-" + currentRow).childNodes;
  let checkWordle = wordle;
  const guess = [];

  rowTiles.forEach((tile) => {
    guess.push({ key: tile.getAttribute("data"), color: "red-overlay" });
  });

  guess.forEach((guess, index) => {
    if (guess.key == wordle[index]) {
      guess.color = "blue-overlay";
      checkWordle = checkWordle.replace(guess.key, "");
    }
  });

  guess.forEach((guess) => {
    if (checkWordle.includes(guess.key)) {
      guess.color = "yellow-overlay";
      checkWordle = checkWordle.replace(guess.key, "");
    }
  });

  rowTiles.forEach((tile, index) => {
    setTimeout(() => {
      tile.classList.add("flip");
      tile.classList.add(guess[index].color);
      addColorToKey(guess[index].key, guess[index].color);
    }, 500 * index);
  });
};

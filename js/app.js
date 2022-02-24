import { wordsList } from "./words.js";
const tileDisplay = document.querySelector(".tile-container");
const keyboard = document.querySelector(".keyboard-container");
const messageDisplay = document.querySelector(".message-container");
const possibleWords = wordsList;

// Tabela onde o usuário tentará acertar a palavra
const wordRows = [
  ["", "", "", "", ""],
  ["", "", "", "", ""],
  ["", "", "", "", ""],
  ["", "", "", "", ""],
  ["", "", "", "", ""],
  ["", "", "", "", ""]
];

// Letras para o teclado
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
  "<<",
  "Z",
  "X",
  "C",
  "V",
  "B",
  "N",
  "M",
  "ENTER",
];

// Variaveis importantes para execução do jogo
let currentRow = 0;
let currentTile = 0;
let isGameOver = false;

// Gera número aleatório que será usado para escolher a palavra do array de palavras
function getRandomIntInclusive(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Criando a palavra a ser adivinhada usando o número aleatório
const wordIndex = getRandomIntInclusive(0, 219);
const word = possibleWords[wordIndex].toUpperCase();

// Transformas as letras em botões, insere o listener e aplica os botões na DOM
keys.forEach((key) => {
  const button = document.createElement("button");
  button.textContent = key;
  button.setAttribute("id", key);
  button.addEventListener("click", () => handleClick(key));
  keyboard.append(button);
});

// Criando as tabelas, os quadrados das tabelas e os enumerando
wordRows.forEach((wordRow, wordRowIndex) => {
  const rowElement = document.createElement("div");
  rowElement.setAttribute("id", "wordRow-" + wordRowIndex);

  wordRow.forEach((char, charIndex) => {
    const tileElement = document.createElement("div");
    tileElement.setAttribute(
      "id",
      "tile-" + charIndex + "-row-" + wordRowIndex
    );
    tileElement.classList.add("tile");
    rowElement.append(tileElement);
  });

  tileDisplay.append(rowElement);
});

// Função que executa o evento clique em todas suas funçoes
const handleClick = (key) => {
  if (!isGameOver) {
    if (key === "<<") {
      deleteChar();
      return;
    }

    if (key === "ENTER") {
      checkRow();
      return;
    }
    addChar(key);
  }
};

// Função que adiciona as letras na tela do jogo
const addChar = (char) => {
  if (currentTile < 5 && currentRow < 6) {
    const tile = document.getElementById(
      "tile-" + currentTile + "-row-" + currentRow
    );
    tile.textContent = char;
    wordRows[currentRow][currentTile] = char;
    tile.setAttribute("data", char);
    currentTile++;
  }
};

// Função que deleta as letras na tela do jogo
const deleteChar = () => {
  if (currentTile > 0) {
    currentTile--;
    const tile = document.getElementById(
      "tile-" + currentTile + "-row-" + currentRow
    );
    tile.textContent = "";
    wordRows[currentRow][currentTile] = "";
    tile.setAttribute("data", "");
  }
};

// Função que exibe mensagem no final do jogo
const showMessage = (message) => {
  const messageBox = document.createElement("p");
  messageBox.textContent = message;
  messageDisplay.append(messageBox);
  setTimeout(() => messageDisplay.removeChild(messageBox), 5000);
};

// Colore o teclado com as devidas cores
const addKeyColor = (keyLetter, color) => {
  const key = document.getElementById(keyLetter);
  key.classList.add(color);
};

// Função responsável pelas animações da "telha"
const flipAndColorTiles = () => {
  const rowTiles = document.querySelector("#wordRow-" + currentRow).childNodes;
  let checkWordle = word.toUpperCase();
  const guess = [];

  // Criando array de objeto (lETRA, COR), conferindo e colorindo letras
  rowTiles.forEach((tile) => {
    guess.push({ letter: tile.getAttribute("data"), color: "grey-overlay" });
  });

  guess.forEach((guess, index) => {
    if (guess.letter == word[index]) {
      guess.color = "green-overlay";
      checkWordle = checkWordle.replace(guess.letter, "");
    }
  });

  guess.forEach((guess) => {
    if (checkWordle.includes(guess.letter)) {
      guess.color = "yellow-overlay";
      checkWordle = checkWordle.replace(guess.letter, "");
    }
  });

  // Adicionando classes de cores e 'flip' para cada "telha" e para as letras do teclado
  rowTiles.forEach((tile, index) => {
    setTimeout(() => {
      tile.classList.add("flip");
      tile.classList.add(guess[index].color);
      addKeyColor(guess[index].letter, guess[index].color);
    }, 500 * index);
  });
};

// Função que executa o jogo (FUNÇÃO MAIS IMPORTANTE)
const checkRow = () => {
  const wordToCheck = wordRows[currentRow].join("");
  if (currentTile > 4) {
    flipAndColorTiles();
    if (word == wordToCheck) {
      showMessage("BRABO! :D");
      isGameOver = true;
      return;
    } else {
      if (currentRow >= 5) {
        isGameOver = true;
        showMessage("Game Over! :(");
        return;
      }
      if (currentRow < 5) {
        currentRow++;
        currentTile = 0;
      }
    }
  }
};

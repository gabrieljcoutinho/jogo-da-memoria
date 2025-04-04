const pokemonList = [
  "charizard", "eeve", "gardevoir", "gengar",
  "giratina", "greninja", "kyurem", "leafeon",
  "mew", "mewtwo", "moltres", "rayquaza",
  "sylveon", "umbreon"
];

const gameBoard = document.getElementById("gameBoard");
const winScreen = document.getElementById("win-screen");
let firstCard = null;
let secondCard = null;
let lockBoard = false;
const correctMessages = ["Que legal!!! ✨", "Incrível! 🤩", "Nossaaaa!! 🌟", "Perfeito! 🎉", "Imparável! 🔥"];
const incorrectMessages = ["Eita!! 😥", "Que pena! 😓", "Tente de novo! 💪", "Não foi dessa vez... 🤔"];
const correctColor = "#22e0ff";
const incorrectColor = "rgba(255, 0, 51, 0.7)";

function createMessage(message, isCorrect) {
  const messageDiv = document.createElement("div");
  messageDiv.textContent = message;
  messageDiv.style.position = "absolute";
  messageDiv.style.color = isCorrect ? correctColor : incorrectColor;
  messageDiv.style.fontWeight = "bold";
  messageDiv.style.fontSize = "1.5em";
  messageDiv.style.zIndex = "10";
  messageDiv.style.pointerEvents = "none";

  const messageWidth = messageDiv.offsetWidth;
  const messageHeight = messageDiv.offsetHeight;
  const verticalPosition = Math.random() * (window.innerHeight - messageHeight - 40) + 20; // Margem vertical

  // Escolhe aleatoriamente o lado (esquerda ou direita)
  const isLeft = Math.random() < 0.5;
  let left;

  if (isLeft) {
      left = Math.random() * (window.innerWidth / 3 - messageWidth - 20) + 20; // Terço esquerdo
      messageDiv.style.textAlign = "left";
  } else {
      left = Math.random() * (window.innerWidth / 3 - messageWidth - 20) + (2 * window.innerWidth / 3 + 20); // Terço direito
      messageDiv.style.textAlign = "right";
  }

  messageDiv.style.top = `${verticalPosition}px`;
  messageDiv.style.left = `${left}px`;

  // Animação de entrada (deslizamento lateral e opacidade)
  messageDiv.style.transform = `translateX(${isLeft ? '-50px' : '50px'})`;
  messageDiv.style.opacity = "0";
  messageDiv.style.transition = "transform 0.3s ease-out, opacity 0.3s ease-out";
  document.body.appendChild(messageDiv);

  messageDiv.offsetHeight; // Força o reflow

  messageDiv.style.transform = "translateX(0)";
  messageDiv.style.opacity = "1";

  setTimeout(() => {
      // Animação de saída (desaparecendo)
      messageDiv.style.transition = "opacity 0.5s ease-in";
      messageDiv.style.opacity = "0";
      setTimeout(() => {
          messageDiv.remove();
      }, 500);
  }, 1500);
}

function createCard(pokemon) {
  const card = document.createElement("div");
  card.classList.add("card");
  card.dataset.pokemon = pokemon;

  card.innerHTML = `
      <div class="card-inner">
          <div class="card-front">
              <img src="imgs/${pokemon}.jpg" alt="${pokemon}">
          </div>
          <div class="card-back"></div>
      </div>
  `;

  card.addEventListener("click", flipCard);
  return card;
}

function flipCard() {
  if (lockBoard || this === firstCard || this.classList.contains("matched")) return;

  this.classList.add("flip");

  if (!firstCard) {
      firstCard = this;
      return;
  }

  secondCard = this;
  checkMatch();
}

function checkMatch() {
  const isMatch = firstCard.dataset.pokemon === secondCard.dataset.pokemon;

  if (isMatch) {
      createMessage(correctMessages[Math.floor(Math.random() * correctMessages.length)], true);
      firstCard.classList.add("matched");
      secondCard.classList.add("matched");

      const allMatched = document.querySelectorAll(".card:not(.matched)").length === 0;
      if (allMatched) {
          setTimeout(() => {
              winScreen.style.display = "flex";
          }, 800);
      }

      resetBoard();
  } else {
      createMessage(incorrectMessages[Math.floor(Math.random() * incorrectMessages.length)], false);
      lockBoard = true;
      setTimeout(() => {
          firstCard.classList.remove("flip");
          secondCard.classList.remove("flip");
          resetBoard();
      }, 1000);
  }
}

function reiniciarJogo() {
  gameBoard.innerHTML = "";
  winScreen.style.display = "none";
  startGame();
}

function resetBoard() {
  [firstCard, secondCard, lockBoard] = [null, null, false];
}

function startGame() {
  const duplicatedList = [...pokemonList, ...pokemonList];
  const shuffled = duplicatedList.sort(() => 0.5 - Math.random());

  shuffled.forEach(pokemon => {
      const card = createCard(pokemon);
      gameBoard.appendChild(card);
  });
}


startGame();
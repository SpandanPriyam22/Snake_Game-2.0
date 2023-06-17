document.addEventListener('DOMContentLoaded', () => {
  const GRID_SIZE = 20;
  const CELL_SIZE = 20;
  const INITIAL_SPEED = 200;
  const SPEED_INCREMENT = 10;
  const SPEED_INTERVAL = 50;

  const gameBoard = document.getElementById('game-board');
  const startButton = document.getElementById('start-button');
  const level1Button = document.getElementById('level1');
  const level2Button = document.getElementById('level2');
  const level3Button = document.getElementById('level3');

  let snake = [
    { x: 10, y: 10 },
    { x: 10, y: 11 },
    { x: 10, y: 12 }
  ];
  let food = { x: 0, y: 0 };
  let direction = { x: 0, y: -1 };
  let speed = INITIAL_SPEED;
  let score = 0;
  let gameOver = false;
  let gameLoop;
  let opacityInterval;

  function createGameElement(className, position) {
    const element = document.createElement('div');
    element.className = className;
    if (position) {
      element.style.left = `${position.x * CELL_SIZE}px`;
      element.style.top = `${position.y * CELL_SIZE}px`;
    }
    return element;
  }

  function drawSnake() {
    snake.forEach((segment, index) => {
      const segmentElement = createGameElement('snake-segment', segment);
      segmentElement.style.zIndex = snake.length - index;
      gameBoard.appendChild(segmentElement);
    });
  }

  function drawFood() {
    const foodElement = createGameElement('food', food);
    gameBoard.appendChild(foodElement);
  }

  function clearBoard() {
    while (gameBoard.firstChild) {
      gameBoard.firstChild.remove();
    }
  }

  function moveSnake() {
    const head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };
    snake.unshift(head);
    if (!hasFoodCollision()) {
      snake.pop();
    }
  }

  function hasFoodCollision() {
    return snake[0].x === food.x && snake[0].y === food.y;
  }

  function checkCollision() {
    if (
      snake.slice(1).some(segment => segment.x === snake[0].x && segment.y === snake[0].y) ||
      snake[0].x < 0 || snake[0].x >= GRID_SIZE ||
      snake[0].y < 0 || snake[0].y >= GRID_SIZE
    ) {
      gameOver = true;
    }
  }

  function updateScore() {
    score++;
    // Update the score display
  }

  function handleKeydown(event) {
    if (event.key === 'ArrowUp' && direction.y !== 1) {
      direction = { x: 0, y: -1 };
    } else if (event.key === 'ArrowDown' && direction.y !== -1) {
      direction = { x: 0, y: 1 };
    } else if (event.key === 'ArrowLeft' && direction.x !== 1) {
      direction = { x: -1, y: 0 };
    } else if (event.key === 'ArrowRight' && direction.x !== -1) {
      direction = { x: 1, y: 0 };
    }
  }

  function handleStart() {
    if (gameOver) {
      resetGame();
    }
    startButton.disabled = true;
    startButton.removeEventListener('click', handleStart);
    document.addEventListener('keydown', handleKeydown);
    gameLoop = setInterval(gameTick, speed);
  }

  function handleGameOver() {
    clearInterval(gameLoop);
    clearInterval(opacityInterval);
    startButton.disabled = false;
    startButton.addEventListener('click', handleStart);
    document.removeEventListener('keydown', handleKeydown);
    gameOver = true;
    // Show game over message
    const gameOverMessage = createGameElement('game-over');
    gameOverMessage.textContent = 'Game Over';
    gameBoard.appendChild(gameOverMessage);
  }

  function resetGame() {
    snake = [
      { x: 10, y: 10 },
      { x: 10, y: 11 },
      { x: 10, y: 12 }
    ];
    direction = { x: 0, y: -1 };
    speed = INITIAL_SPEED;
    score = 0;
    gameOver = false;
    clearBoard();
  }

  function gameTick() {
    clearBoard();
    moveSnake();
    checkCollision();

    if (gameOver) {
      handleGameOver();
      return;
    }

    if (hasFoodCollision()) {
      updateScore();
      createFood();
      if (speed > SPEED_INCREMENT) {
        clearInterval(gameLoop);
        clearInterval(opacityInterval);
        speed -= SPEED_INCREMENT;
        gameLoop = setInterval(gameTick, speed);
      }
    }

    drawSnake();
    drawFood();

    if (level1Button.classList.contains('active')) {
      clearBoard(); // Clear the board when Level 1 is active
    }
  }

  function createFood() {
    const maxPosition = GRID_SIZE - 1;
    let newFood;
    do {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE)
      };
    } while (snake.some(segment => segment.x === newFood.x && segment.y === newFood.y));
    food = newFood;
  }

  level1Button.addEventListener('click', () => {
    level1Button.classList.toggle('active');
    level2Button.classList.remove('active');
    level3Button.classList.remove('active');
    clearBoard(); // Clear the board when Level 1 is active
    changeButtonColor(level1Button); // Change button color
  });

  level2Button.addEventListener('click', () => {
    level1Button.classList.remove('active');
    level2Button.classList.toggle('active');
    level3Button.classList.remove('active');
    clearBoard();
    // Add Level 2 logic here
    changeButtonColor(level2Button); // Change button color
  });

  level3Button.addEventListener('click', () => {
    level1Button.classList.remove('active');
    level2Button.classList.remove('active');
    level3Button.classList.toggle('active');
    clearBoard();
    // Add Level 3 logic here
    changeButtonColor(level3Button); // Change button color
  });

  startButton.addEventListener('click', handleStart);
});

function changeButtonColor(button) {
  const levelButtons = document.querySelectorAll('.level-button');
  levelButtons.forEach(btn => {
    if (btn === button) {
      btn.style.backgroundColor = '#FB2576'; // Set the active button color
    } else {
      btn.style.backgroundColor = '#4CAF50'; // Set the inactive button color
    }
  });
}

const levelButtons = document.querySelectorAll('.level-button');
levelButtons.forEach(button => {
  button.addEventListener('click', function () {
    changeButtonColor(this);
  });
});

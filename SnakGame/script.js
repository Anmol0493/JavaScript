let inputDirection = { x: 0, y: 0 };
const foodSound = new Audio("/music/food.mp3");
const moveSound = new Audio("/music/move.mp3");
const gameOverSound = new Audio("/music/gameover.mp3");
const musicSound = new Audio("/music/music.mp3");

let speed = 5;
let lastCTime = 0;

let snakeArr = [
    { x: 12, y: 13 }
];
let food = { x: 6, y: 6 };


let score = 0;
let highScore = localStorage.getItem("highScore");
if (highScore === null) {
    newHighScore = 0;
    localStorage.setItem("highScore", JSON.stringify(newHighScore));
} else {
    highScore.value = JSON.parse(highScore);
    highscoreBox.innerHTML = "Highest Score: " + highScore;
}
const initialSpeed = 2;
const speedIncrement = 0.5;


// game functions
function main(ctime) {
    window.requestAnimationFrame(main);
    if ((ctime - lastCTime) / 1000 < 1 / speed) {
        return;
    }
    lastCTime = ctime;
    gameEngine();

    // Increase speed every 5 points
    const scoreIncrement = Math.floor(score / 5);
    speed = initialSpeed + speedIncrement * scoreIncrement;
}

function isCollide(snake) {
    // if snake bites own body
    for (let i = 1; i < snakeArr.length; i++) {
        if (snake[i].x === snake[0].x &&
            snake[i].y === snake[0].y) {
            return true;
        }
    }
    // if snake collides with walls
    if (snake[0].x >= 16 || snake[0].x <= 0 ||
        snake[0].y >= 16 || snake[0].y <= 0) {
        return true;
    }
}

function gameEngine() {
    // reset the game
    if (isCollide(snakeArr)) {
        gameOverSound.play();
        musicSound.pause();
        inputDirection = { x: 0, y: 0 };
        alert("Game Over!, press spacebar or enter key to restart the game");
        snakeArr = [{ x: 13, y: 15 }];
        score = 0;
        scoreBox.innerHTML = "Score: " + score;
    }

    // update the snake array (position), score and food
    if (snakeArr[0].y === food.y && snakeArr[0].x === food.x) {
        foodSound.play();
        score += 1;
        scoreBox.innerHTML = "Score: " + score;
        if (score > highScore) {
            highScore = score;
            localStorage.setItem("highScore", JSON.stringify(highScore));
            highscoreBox.innerHTML = "Highest Score: " + highScore;
        }
        snakeArr.unshift({
            x: snakeArr[0].x + inputDirection.x,
            y: snakeArr[0].y + inputDirection.y
        });
        let a = 2;
        let b = 15;
        food = {
            x: Math.round(a + (b - a) * Math.random()),
            y: Math.round(a + (b - a) * Math.random())
        }
    };

    // move the snake
    for (let i = snakeArr.length - 2; i >= 0; i--) {
        snakeArr[i + 1] = { ...snakeArr[i] };
    }
    snakeArr[0].x += inputDirection.x;
    snakeArr[0].y += inputDirection.y;


    // render the snake and food
    board.innerHTML = "";
    snakeArr.forEach((e, index) => {
        snakeElement = document.createElement("div");
        snakeElement.style.gridRowStart = e.y;
        snakeElement.style.gridColumnStart = e.x;
        if (index === 0) {
            snakeElement.classList.add('snakehead');
            // Inside the gameEngine function
            snakeElement.classList.add('snakehead');

            // Create eye elements
            const eye1 = document.createElement("div");
            eye1.classList.add("eye");
            snakeElement.appendChild(eye1);

            const eye2 = document.createElement("div");
            eye2.classList.add("eye");
            snakeElement.appendChild(eye2);

            const pupil1 = document.createElement("div");
            pupil1.classList.add("pupil");
            eye1.appendChild(pupil1);

            const pupil2 = document.createElement("div");
            pupil2.classList.add("pupil");
            eye2.appendChild(pupil2);

        } else {
            snakeElement.classList.add('snakebody');
        }
        board.appendChild(snakeElement);
    });

    foodElement = document.createElement("div");
    foodElement.style.gridRowStart = food.y;
    foodElement.style.gridColumnStart = food.x;
    foodElement.classList.add('food');
    board.appendChild(foodElement);
}


// Game logic
window.requestAnimationFrame(main);
window.addEventListener('keydown', (e) => {
    if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)) {
        e.preventDefault();
        moveSound.play();
        musicSound.play();
        switch (e.key) {
            case "ArrowUp":
                inputDirection.x = 0;
                inputDirection.y = -1;
                break;
            case "ArrowDown":
                inputDirection.x = 0;
                inputDirection.y = 1;
                break;
            case "ArrowLeft":
                inputDirection.x = -1;
                inputDirection.y = 0;
                break;
            case "ArrowRight":
                inputDirection.x = 1;
                inputDirection.y = 0;
                break;

            default:
                break;
        }
    }
})
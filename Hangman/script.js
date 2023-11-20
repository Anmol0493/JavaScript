const inputs = document.querySelector(".inputs");
const hintTag = document.querySelector(".hint span");
const guessLeft = document.querySelector(".guess-left span");
const wrongLetter = document.querySelector(".wrong-letter span");
const resetBtn = document.querySelector(".reset-btn");
const typingInput = document.querySelector(".typing-input");

let word, maxGuesses, incorrectLetters = [], correctLetters = [];

function randomWord() {
    let ranItem = wordList[Math.floor(Math.random() * wordList.length)];
    word = ranItem.word;
    maxGuesses = word.length;
    correctLetters = [];
    incorrectLetters = [];
    hintTag.innerText = ranItem.hint;
    guessLeft.innerText = maxGuesses;
    wrongLetter.innerText = incorrectLetters;

    let html = "";
    for (let i = 0; i < word.length; i++) {
        html += `<input type="text" disabled>`;
        inputs.innerHTML = html;
    }
}
randomWord();

function initGame(e) {
    let letter = e.target.value.toLowerCase();
    if(letter.match(/^[A-Za-z]+$/) &&
            !incorrectLetters.includes(` ${letter}`) &&
                !correctLetters.includes(letter)) {
        if(word.includes(letter)) {
            for (let i = 0; i < word.length; i++) {
                if(word[i] == letter) {
                    correctLetters += letter;
                    inputs.querySelectorAll("input")[i].value = letter;
                }
            }
        } else {
            maxGuesses--;
            incorrectLetters.push(` ${letter}`);
        }
        guessLeft.innerText = maxGuesses;
        wrongLetter.innerText = incorrectLetters;
    }
    typingInput.value = "";

    setTimeout(() => {
        if(correctLetters.length === word.length) {
            alert(`Congrats! You found the word ${word.toUpperCase()}`);
            return randomWord();
        } else if(maxGuesses < 1) {
            alert("Game over! You don't have remaining guesses");
            for(let i = 0; i < word.length; i++) {
                inputs.querySelectorAll("input")[i].value = word[i];
            }
        }
    }, 100);
}

resetBtn.addEventListener("click", randomWord);
typingInput.addEventListener("input", initGame);
inputs.addEventListener("click", () => typingInput.focus());
document.addEventListener("keydown", () => typingInput.focus());
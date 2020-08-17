import {gameController} from "./game.js";

const displayController = (function(doc) {
    const gameOutputStr = "game-output";
    const hideOutputStr = `${gameOutputStr}--hide`;
    const showOutputStr = `${gameOutputStr}--show`;

    const board = doc.getElementById("board");
    const nameInputOne = doc.getElementById("p1-name");
    const nameInputTwo = doc.getElementById("p2-name");
    const opponentInputOne = doc.getElementById("player");
    const opponentInputTwo = doc.getElementById("computer");
    const form = doc.querySelector(".form");
    const gameOutput = doc.querySelector(`.${gameOutputStr}`);
    let gameSettings = {};

    function removeChildren(node) {
        while (node.firstChild) {
            node.removeChild(node.firstChild);
        }
    }

    function handleOpponentChange() {
        if (this.id === "computer") {
            nameInputTwo.value = "Computer";
            nameInputTwo.setAttribute("readonly", "");
        } else {
            nameInputTwo.value = "Player 2";
            nameInputTwo.removeAttribute("readonly");
        }
    }

    function detectOpponentChanges() {
        const opponentInputs = [opponentInputOne, opponentInputTwo];
        opponentInputs.forEach(opponent => {
            const func = handleOpponentChange.bind(opponent);
            opponent.addEventListener("input", func, false);
        });
    }

    function setGameSettings() {
        const opponent = (opponentInputOne.checked) ? "player" : "computer";
        gameSettings.opponent = opponent;
        gameSettings.playerOneName = nameInputOne.value;
        gameSettings.playerTwoName = nameInputTwo.value;
    }

    function clearMessage() {
        removeChildren(gameOutput);
        gameOutput.insertAdjacentHTML("beforeend", "&nbsp;");
        gameOutput.classList.remove(showOutputStr);
        gameOutput.classList.add(hideOutputStr);
    }

    function activateGame(event) {
        event.preventDefault();
        render();
        clearMessage();
        toggleActiveInputs();
        setGameSettings();
    }

    const getGameSettings = () => gameSettings;
    const resetGameSettings = () => {gameSettings = {};};

    function toggleActiveInputs() {
        const formInputs = Array.from(form.getElementsByTagName("input"));
        formInputs.forEach(input => {
            input.disabled = !(input.disabled);
        });
    }

    function render() {
        const gameBoardArray = gameController.getGameBoard();
        const boardCells = Array.from(board.children);
        boardCells.forEach((cell, index) => {
            removeChildren(cell);
            cell.insertAdjacentHTML("beforeend", gameBoardArray[index]);
        });
    }

    function showMessage(outputString) {
        removeChildren(gameOutput);
        gameOutput.insertAdjacentText("beforeend", outputString);
        gameOutput.classList.remove(hideOutputStr);
        gameOutput.classList.add(showOutputStr);
    }

    (function() {
        nameInputOne.value = "Player 1";
        nameInputTwo.value = "Player 2";
        detectOpponentChanges();
        form.addEventListener("submit", activateGame, false);
    })();

    return {board, getGameSettings, resetGameSettings, toggleActiveInputs, render, showMessage};
})(document);

export {displayController};
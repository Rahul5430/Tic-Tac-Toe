import {gameBoard} from "./board.js";
import {displayController} from "./display.js";

const playerFactory = (name, marker, isMyTurn) => {
    return {name, marker, isMyTurn};
};

const gameController =  (function() {
    const boardElement = displayController.board;
    let computerOpponent = false;
    let playerOne;
    let playerTwo;
    let gameWinner;

    const isPlayerTurn = (player) => player.isMyTurn;

    function getActivePlayer() {
        return isPlayerTurn(playerOne) ? playerOne : playerTwo;
    }

    function changeTurns(){
        if (isPlayerTurn(playerOne)) {
            playerOne.isMyTurn = false;
            playerTwo.isMyTurn = true;
        } else {
            playerOne.isMyTurn = true;
            playerTwo.isMyTurn = false;
        }
    }

    function containsMarker(marker, adjacentItems) {
        return adjacentItems.some(arr => arr.every(item => item === marker));
    }

    function isWinner(marker, boardTuples) {
        return (
            containsMarker(marker, boardTuples.rows) ||
            containsMarker(marker, boardTuples.columns) ||
            containsMarker(marker, boardTuples.diagonals)
        );
    }

    function winnerFound() {
        const boardTuples = {
            rows: gameBoard.getRows(),
            columns: gameBoard.getColumns(),
            diagonals: gameBoard.getDiagonals()
        };
        if (isWinner(playerOne.marker, boardTuples)) {
            gameWinner = playerOne;
        } else if (isWinner(playerTwo.marker, boardTuples)) {
            gameWinner = playerTwo;
        }
        return (!!gameWinner);
    }

    function isGameOver() {
        return (winnerFound() || gameBoard.isFilled());
    }

    function resetPlayers() {
        playerOne = null;
        playerTwo = null;
        gameWinner = null;
        computerOpponent = false;
    }

    function endGame() {
        let gameResult = (gameWinner) ? `${gameWinner.name} wins` : "Tie Game";
        gameResult = gameResult.toUpperCase();
        displayController.showMessage(gameResult);
        resetPlayers();
        displayController.resetGameSettings();
        displayController.toggleActiveInputs();
        gameBoard.clear();
    }

    function executeComputerPlay() {
        const boardArrayLen = gameBoard.get().length;
        let randIndex;
        let isUpdated;
        do {
            randIndex = Math.floor(Math.random() * boardArrayLen);
            isUpdated = gameBoard.update(randIndex, playerTwo.marker);
        } while (!isUpdated);
        displayController.render();
    }

    function executePlay(player, cellIndex) {
        const wasUpdated = gameBoard.update(cellIndex, player.marker);
        if (wasUpdated) {
            displayController.render();
            if (isGameOver()) {
                endGame();
            } else if (!computerOpponent) {
                changeTurns();
            } else if (computerOpponent) {
                executeComputerPlay();
            }
        }
    }

    function assignPlayers() {
        const gameSettings = displayController.getGameSettings();
        if (Object.keys(gameSettings).length) {
            playerOne = playerFactory(gameSettings.playerOneName, "X", true);
            playerTwo = playerFactory(gameSettings.playerTwoName, "O", false);
            if (gameSettings.opponent === "computer") {
                computerOpponent = true;
            }
        }
    }

    function hasGameSettings() {
        if (playerOne && playerTwo) {
            return true;
        } else {
            assignPlayers();
            return (playerOne && playerTwo);
        }
    }

    function handleBoardClick({target}) {
        if (!hasGameSettings()) return;
        const cellClicked = target.closest(".board-cell");
        if (cellClicked) {
            const cellIndex = parseInt(cellClicked.dataset.cellNumber) - 1;
            const activePlayer = getActivePlayer();
            executePlay(activePlayer, cellIndex);
        } 
    }

    boardElement.addEventListener("click", handleBoardClick, false);

    return {getGameBoard: () => gameBoard.get()};

})();

export {gameController};
import {gameBoard} from "./board.js";
import {displayController} from "./display.js";

const playerFactory = (name, marker, isMyTurn) => {
    return {name, marker, isMyTurn};
};
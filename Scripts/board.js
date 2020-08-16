const gameBoard = (function() {
    const DIMENSIONS = 3;
    const NUM_CELLS = Math.pow(DIMENSIONS, 2);
    const boardArray = Array(NUM_CELLS).fill("");
    const get = () => boardArray;

    function isEmptyCell(index) {
        return (!boardArray[index]);
    }

    function isFilled() {
        return boardArray.every((cell, index) => !isEmptyCell(index));
    }

    function getRows() {
        const boardArrayCopy = Array.from(boardArray);
        const rowsArray = [];
        while (boardArrayCopy.length) {
            rowsArray.push(boardArrayCopy.splice(0, DIMENSIONS));
        }
        return rowsArray;
    }

    function getColumns() {
        const columnsArray = Array.from({length: DIMENSIONS}, () => []);
        for (let i = 0; i < NUM_CELLS; i++) {
            columnsArray[i % DIMENSIONS].push(boardArray[i]);
        }
        return columnsArray;
    }

    function getDiagonals() {
        const diagonalsArray = Array.from({length: 2}, () => []);
        const rowsArray = getRows();
        rowsArray.forEach((row, index) => {
            diagonalsArray[0].push(row[index]);
            diagonalsArray[1].push(row[DIMENSIONS - 1 - index]);
        });
        return diagonalsArray;
    }

    function hasCell(cellIndex) {
        return (cellIndex >= 0 && cellIndex < boardArray.length);
    }

    function update(index, marker) {
        if (!hasCell(index) || !isEmptyCell(index)) return false;
        boardArray[index] = marker;
        return true;
    }

    function clear() {
        for (let i = 0; i < boardArray.length; i++) {
            boardArray[i] = "";
        }
    }

    return {get, getRows, getColumns, getDiagonals, isFilled, hasCell, update, clear};
})();

export {gameBoard};
'use strict';
console.log('Hello MineSweeper!');

const MINE = '🧨';
var board = [];
var gLevel = {
    size: 4,
    mines: 2
};
var gGame = {
    isOn: false,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0
};

function init() {
    board = buildBoard();
    renderBoard(board);
    setMinesNegsCount(board);
}

function buildBoard() {
    var board = [];
    for (var i = 0; i < gLevel.size; i++) {
        board[i] = [];
        for (var j = 0; j < gLevel.size; j++) {
            var cell = {
                minesAroundCount: 0,
                isShown: true,
                isMine: false,
                isMarked: false
            };
            board[i][j] = cell;
            // console.log(cell);
        }
    }
    console.table(board);
    return board;
}

function renderBoard(board) {
    var strHTML = '<table class="table" onclick=cellClicked()><tbody>';
    for (var i = 0; i < board.length; i++) {
        strHTML += '<tr>\n';
        for (var j = 0; j < board[0].length; j++) {
            board[1][2].isMine = true;
            board[3][1].isMine = true;
            var cell = board[i][j];
            if (cell.isMine === true) {
                cell.isShown = true;
                var strMine = '\t<td class="cell cell"' + i + '-' + j + '"> ' + '🧨' + ' </td>\n'
                strHTML += strMine;
            }
            else {
                var className = 'cell cell' + i + '-' + j;
                strHTML += '\t<td class="' + className + '"> ' + cell + '' + ' </td>\n'; //change the cell
            }
        }
        strHTML += '\t</tr>\n'
    }
    strHTML += '</tbody></table>';
    // console.log(strHTML);
    var gelBoard = document.querySelector('.board-container');
    gelBoard.innerHTML = strHTML;
}


function setMinesNegsCount(board) {
    var minesAroundCount = 0;
    for (var i = 0; i < board.length; i++) {
        board[i] = [];
        for (var j = 0; j < board[i].length; j++) {
            for (var x = i - 1; x <= i + 1; x++) {
                if (x < 0 || x >= board.length) continue;
                for (var y = j - 1; y <= j + 1; j++) {
                    var cell = { x: x, y: y };
                    if (x < 0 || y >= board[i].length) continue;
                    if (x === x && y === y) continue;
                    if(board[cell.x][cell.y].isMine===true){
                        minesAroundCount++;
                    }
                }
            }
            if(board[i][j] === 0) board[i][j] = '';
            else board[i][j]= minesAroundCount;
            minesAroundCount =0;
        }
    }
    console.log(board);
    return board;
}





function getRandomIntInclusive(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// var res = [];
// for (var i = pieceCoord.i - 1; i <= pieceCoord.i + 1; i++) {
//     if (i < 0 || i >= gBoard.length) continue;
//     for (var j = pieceCoord.j - 1; j <= pieceCoord.j + 1; j++) {
//         var cell = { i: i, j: j };
//         if (j < 0 || j >= gBoard[i].length) continue;
//         if (i === pieceCoord.i && j === pieceCoord.j) continue;
//         if (isEmptyCell(cell)) res.push(cell);
//     }
// }
// return res;

// function getCellId(strCellId) {
//     // console.log(strCellId);
//     var idx = {};
//     var parts = strCellId.split('-');
//     idx.i = +parts[0]
//     idx.j = +parts[1];
//     return idx;
// }

        // spradeRandomMines()

        // function spradeRandomMines() {
        //     if (gLevel.size === 4) {
        //         var row = getRandomIntInclusive(0, gLevel.size - 1);
        //         var col = getRandomIntInclusive(0, gLevel.size - 1);
        //         console.log(row, col);
        //         for()
        //         // while (gBoard[row][col].isMine === false && ) {
        //         //     // console.log(row, col);
        //         //     gBoard[row][col] = MINE;
        //         //     console.log(gBoard[row][col]);
        //         //     row = getRandomIntInclusive(0, gLevel.size-1);
        //         //     col = getRandomIntInclusive(0, gLevel.size-1);
        //         }
        //     }

        // }
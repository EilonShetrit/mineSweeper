'use strict';
console.log('Hello MineSweeper!');

const MINE = '🧨';
const MARK = '🗽';
// gStopwatchInteval;
var gBoard;
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
    gBoard = buildBoard();
    setMinesNegsCount(gBoard);
    renderBoard(gBoard);
}

function buildBoard() {
    var board = [];
    for (var i = 0; i < gLevel.size; i++) {
        board[i] = [];
        for (var j = 0; j < gLevel.size; j++) {
            var cell = {
                minesAroundCount: 0,
                isShown: false,
                isMine: false,
                isMarked: false
            };
            board[i][j] = cell;
            // console.log(cell);
        }
    }
    for (var i = 0; i < 2; i++) {
        spradeRandomMines(board);
    }
    console.table(board);
    return board;
}

function renderBoard(board) {
    var strHTML = '<table><tbody class="table">';
    for (var i = 0; i < board.length; i++) {
        strHTML += '<tr>\n';
        var row = board[i];
        for (var j = 0; j < board[0].length; j++) {
            var cell = row[j];
            var content = '';
            var className = 'cell-' + i + '-' + j;
            if (cell.isShown) {
                if (cell.isMine) content = MINE;
                else content = cell.minesAroundCount;
            }
            strHTML += '\t<td class="' + className + '" onclick="cellClicked(this,' + i + ',' + j + ')" oncontextmenu="cellMarked(this,' + i + ',' + j + ')"> ' + content + '</td>\n';
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
        for (var j = 0; j < board[i].length; j++) {
            minesAroundCount = countNegsMines(i, j);
            board[i][j].minesAroundCount = minesAroundCount;
        }
    }
    // console.log(board);
    return board;
}

function countNegsMines(posI, posJ) {
    var mineCount = 0;
    for (var i = posI - 1; i <= posI + 1; i++) {
        if (i < 0 || i >= gBoard.length) continue;
        for (var j = posJ - 1; j <= posJ + 1; j++) {
            var idx = { i: i, j: j };
            if (j < 0 || j >= gBoard[i].length) continue;
            if (i === posI && j === posJ) continue;
            if (gBoard[idx.i][idx.j].isMine === true) mineCount++;
        }
    }
    return mineCount;
}

// gStopwatchInteval = setInterval(countTime, 1000);
// clearInterval(gStopwatchInteval)
function cellClicked(elCell, i, j) {
    if (gGame.isOn === false) setInterval(countTime, 1000);
    gGame.isOn = true;
    // console.log('elCell', elCell, 'i-', i, 'j-', j);
    var empty = '';
    gBoard[i][j].isShown = true;
    elCell.classList.add('show');
    if (gBoard[i][j].isMine) renderCell(i, j, MINE);
    else if (gBoard[i][j].minesAroundCount > 0) renderCell(i, j, gBoard[i][j].minesAroundCount);
    else if (gBoard[i][j].minesAroundCount === 0) renderCell(i, j, empty);
}


function renderCell(i, j, value) {
    var elCell = document.querySelector(`.cell-${i}-${j}`);
    elCell.innerHTML = value;
    // console.log(elCell.innerHTML);
}

function spradeRandomMines(board) {
    var row = getRandomIntInclusive(0, gLevel.size - 1);
    var col = getRandomIntInclusive(0, gLevel.size - 1);
    while (board[row][col].isMine) {
        row = getRandomIntInclusive(0, gLevel.size - 1);
        col = getRandomIntInclusive(0, gLevel.size - 1);
    }
    board[row][col].isMine = true;
    console.log('row', row, 'col', col);
}

function countTime() {
    var elTimer = document.querySelector('.timer');
    elTimer.innerHTML = ++gGame.secsPassed;
}

function cellMarked(elCell,i ,j){
    gBoard[i][j].isMarked = true;
    renderCell(i,j,MARK);
}


// function checkGameOver(){

// }
function getRandomIntInclusive(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
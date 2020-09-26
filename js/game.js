'use strict';
console.log('Hello MineSweeper!');

const MINE = '💣';
const FLAG = '🗽';
var gStopwatchInteval;
var gBoard;
var gLevel = {
    size: 4,
    mines: 2
};
var gGame = {
    isOn: true,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0
};
function init() {
    gBoard = buildBoard();
    setMinesNegsCount(gBoard);
    renderBoard(gBoard);
    gGame = {
        isOn: true,
        shownCount: 0,
        markedCount: 0,
        secsPassed: 0,
    };
    clearInterval(gStopwatchInteval);
    resetTime();
    countMark();
}

function chooseLevel(elBtn) {
    // var elBombs = document.querySelector(".bombs span");
    // var elLives = document.querySelector(".lives span");
    var level = elBtn.innerText;
    console.log(level);
    if (level === "Easy") {
        gLevel = {
            size: 4,
            mines: 2,
            // LIVES: 1,
        };
        init();
    } else if (level === "Medium") {
        gLevel = {
            size: 8,
            mines: 12,
            // LIVES: 3,
        };
        init();
    } else if (level === "Hard") {
        gLevel = {
            size: 12,
            mines: 30,
            // LIVES: 3,
        };
        init();
    }
    // var harts;
    // // var numBomb;
    // switch (gLevel.MINES) {
    //   case 2:
    //     harts = HEART;
    //     numBomb = 2;
    //     break;
    //   case 12:
    //     harts = HEART + HEART + HEART;
    //     numBomb = 12;
    //     break;
    //   case 30:
    //     harts = HEART + HEART + HEART;
    //     numBomb = 30;
    //     break;
    // }
    // elLives.innerText = harts;
    // elBombs.innerText = numBomb;
    // document.querySelector(".smiley").innerText = NORMAL; //RESET THE SMILEY
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
    for (var i = 0; i < gLevel.mines; i++) {
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
            strHTML += '\t<td id="cell-id" class= "' + className + '" onclick="cellClicked(this,' + i + ',' + j + ')" oncontextmenu="cellMarked(this,' + i + ',' + j + ')"> ' + content + '</td>\n';
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

function renderCell(i, j, value) {
    var elCell = document.querySelector(`.cell-${i}-${j}`);
    elCell.innerHTML = value;
    // console.log(elCell.innerHTML);
}


function cellClicked(elCell, i, j) {

    if (gGame.isOn === false) return;
    if (gGame.shownCount === 0) gStopwatchInteval = setInterval(countTime, 1000);
    if (gBoard[i][j].isMine === true) checkGameOver();
    if (gBoard[i][j].isShown === false) gGame.shownCount++;
    // console.log('gGame.shownCount' ,gGame.shownCount) 
    // console.log('elCell', elCell, 'i-', i, 'j-', j);
    var empty = '';
    if (gBoard[i][j].isMarked === false) {
        gBoard[i][j].isShown = true;
        elCell.classList.add('show');
        if (gBoard[i][j].isMine) {
            renderCell(i, j, MINE);
            elCell.style.backgroundColor = 'red';
        }
        else if (gBoard[i][j].minesAroundCount > 0) renderCell(i, j, gBoard[i][j].minesAroundCount);
        else if (gBoard[i][j].minesAroundCount === 0) renderCell(i, j, empty);
    }
    checkWin()
}

function countTime() {
    var elTimer = document.querySelector('.timer');
    elTimer.innerHTML = 'Time : ' + ++gGame.secsPassed;
}
function countMark() {
    var elMark = document.querySelector('.count-mark');
    console.log(elMark);
    elMark.innerText = 'Mark : ' + gGame.markedCount;
    console.log(elMark.innerText);
}
function cellMarked(elCell, i, j) {
    var empty = '';
    if (gBoard[i][j].isShown === false) {
        if (gBoard[i][j].isMarked === false) {
            gBoard[i][j].isMarked = true;
            renderCell(i, j, FLAG)
            gGame.markedCount++;
            console.log('gGame.markedCount', gGame.markedCount);
        }
        else {
            gBoard[i][j].isMarked = false;
            renderCell(i, j, empty);
            gGame.markedCount--;
            console.log('gGame.markedCount', gGame.markedCount);
        }
    }
    countMark();
    checkWin();
}

function checkWin() {
    var size = (gLevel.size * gLevel.size) - gLevel.mines;
    if (gGame.markedCount === gLevel.mines && gGame.shownCount === size) {
        gGame.isOn = false; //ok
        console.log('Win!');
        clearInterval(gStopwatchInteval);
    }
}
function checkGameOver() {
    // var elcell = document.getElementById('cell-id')
    // console.log(elcell);
    for (var i = 0; i < gLevel.size; i++) {
        for (var j = 0; j < gLevel.size; j++) {
            var currCell = gBoard[i][j];
            if (currCell.isMine === true) {
                currCell.isShown = true;
                // elCell.style.backgroundColor = 'gray';
                renderCell(i, j, MINE);
                gGame.isOn = false;
                clearInterval(gStopwatchInteval);
            }
        }
    }
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

function getRandomIntInclusive(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
function resetTime() {
    var elTimer = document.querySelector('.timer');
    elTimer.innerHTML = 'Time : ' + gGame.secsPassed;
}
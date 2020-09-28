'use strict';
console.log('Hello MineSweeper!');

const MINE = '💣';
const FLAG = '🗽';
const HEART = '❤️';
const SMILEY = '😀';
const FINISH = '😑';
var gTimeInterval;
var gelVictory = document.querySelector('.victory');
var gBoard;
var gLevel = {
    size: 4,
    mines: 2,
    lives: 2
};
var gGame = {
    isOn: true,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0,
    isFirstClick: true
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
        isFirstClick: true
    };
    clearInterval(gTimeInterval);
    resetTime();
    countMark();
    setLives();
    updetIcon();
    gelVictory.style.display = 'none';
}

function chooseLevel(elBtn) {
    var level = elBtn.innerText;
    console.log(level);
    if (level === "Easy") {
        gLevel = {
            size: 4,
            mines: 2,
            lives: 2,
        };
        init();
    } else if (level === "Medium") {
        gLevel = {
            size: 8,
            mines: 12,
            lives: 3,
        };
        init();
    } else if (level === "Hard") {
        gLevel = {
            size: 12,
            mines: 30,
            lives: 3
        };
        init();
    }
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
}


function cellClicked(elCell, i, j) {
    var elIcon = document.querySelector('.icon');
    if (!gGame.isOn) return;
    if (gGame.shownCount === 0) gTimeInterval = setInterval(countTime, 1000);
    if (gBoard[i][j].isMine) checkGameOver();
    if (!gBoard[i][j].isShown) gBoard[i][j].isShown = true;
    gGame.shownCount++;
    if (gBoard[i][j].minesAroundCount === 0 && !gBoard[i][j].isMine) {
        expandShown(gBoard, i, j);
    }
    var empty = '';
    if (gBoard[i][j].isMarked === false) {
        gBoard[i][j].isShown = true;
        elCell.classList.add('show');
        if (gBoard[i][j].isMine) {
            renderCell(i, j, MINE);
            elCell.style.backgroundColor = 'red';
            elIcon.innerHTML = FINISH;
        }
        else if (gBoard[i][j].minesAroundCount > 0) renderCell(i, j, gBoard[i][j].minesAroundCount);
        else if (gBoard[i][j].minesAroundCount === 0) renderCell(i, j, empty);
    }
    // renderBoard(gBoard);
    checkWin();
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

function expandShown(board, row, col) {
    var value = '';
    for (var i = row - 1; i <= row + 1; i++) {
        if (i < 0 || i >= board.length) continue;
        for (var j = col - 1; j <= col + 1; j++) {
            if (j < 0 || j >= board[i].length) continue;
            var currCell = board[i][j];
            if (i === row && j === col) continue;
            if (!currCell.isShown) {
                currCell.isShown = true;
                gGame.shownCount++;
            }
            if (currCell.minesAroundCount > 0) {
                value = currCell.minesAroundCount;
            }
            renderCell(i, j, value);
        }
    }
}

function checkWin() {
    var size = (gLevel.size * gLevel.size) - gLevel.mines;
    if (gGame.markedCount === gLevel.mines && gGame.shownCount === size) {
        gGame.isOn = false;
        gelVictory.style.display = 'block';
        console.log('Win!');
        clearInterval(gTimeInterval);
    }
}

function checkGameOver() {
    var elIcon = document.querySelector('.icon');
    for (var i = 0; i < gLevel.size; i++) {
        for (var j = 0; j < gLevel.size; j++) {
            var currCell = gBoard[i][j];
            if (currCell.isMine === true)
                //  updateLives(i,j,MINE);
                gGame.isOn = false;
            elIcon.innerHTML = FINISH;
            clearInterval(gTimeInterval);
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
function setLives() {
    var elLives = document.querySelector(".lives");
    // console.log(elLives);
    var harts;
    switch (gLevel.mines) {
        case 2:
            harts = HEART + HEART;
            break;
        case 12:
            harts = HEART + HEART + HEART;
            break;
        case 30:
            harts = HEART + HEART + HEART;
            break;
    }
    elLives.innerHTML = harts;
    resetTime();
}


function getRandomIntInclusive(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
function resetTime() {
    var elTimer = document.querySelector('.timer');
    elTimer.innerHTML = 'Time : ' + gGame.secsPassed;
}

function updetIcon() {
    var elIcon = document.querySelector('.icon');
    elIcon.innerText = SMILEY;
}


// function updateLives(i,j,value) {
//     var currCell = gBoard[i][j];
//     var elLives = document.querySelector(".lives");
//     if (elLives.innerHTML === 3) {
//         currCell.isShown = true;
//         elLives.innerHTML = HEART + HEART;
//         setInterval(renderCell(i, j, value), 1000);
//     }
//     else if (elLives.innerHTML === 2) {
//         currCell.isShown = true;
//         elLives.innerHTML = HEART + HEART;
//         setInterval(renderCell(i, j, value), 1000);
//     }
//     else if (elLives.innerHTML === 1) {
//         currCell.isShown = true;
//         elLives.innerHTML = HEART + HEART;
//         setInterval(renderCell(i, j, value), 1000);
//     }
//     clearInterval(renderCell(i, j, value));
//     currCell.isShown = false;
// }

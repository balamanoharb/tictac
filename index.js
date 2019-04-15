/**
* This program is a boilerplate code for the standard tic tac toe game
* Here the “box” represents one placeholder for either a “X” or a “0”
* We have a 2D array to represent the arrangement of X or O is a grid
* 0 -> empty box
* 1 -> box with X - player
* 2 -> box with O - computer
*
* Below are the tasks which needs to be completed:
* Imagine you are playing with the computer so every alternate move should be done by the computer
* X -> player
* O -> Computer
*
* Winner needs to be decided and has to be flashed
*
* Extra points will be given for approaching the problem more creatively
* 
*/

const grid = [];
const GRID_LENGTH = 3;
const human = 1;
const computer = 2;
let currentPlayer = human;
let numberOfMoves = 0;
let freeze = false;
// store the humanmoves;
let humanMoves = [];
let computerMoves = [];
function initializeGrid() {
    for (let colIdx = 0;colIdx < GRID_LENGTH; colIdx++) {
        const tempArray = [];
        for (let rowidx = 0; rowidx < GRID_LENGTH;rowidx++) {
            tempArray.push(0);
        }
        grid.push(tempArray);
    }
}

function getRowBoxes(colIdx) {
    let rowDivs = '';
    
    for(let rowIdx=0; rowIdx < GRID_LENGTH ; rowIdx++ ) {
        let additionalClass = 'darkBackground';
        let content = '';
        const sum = colIdx + rowIdx;
        if (sum%2 === 0) {
            additionalClass = 'lightBackground'
        }
        const gridValue = grid[colIdx][rowIdx];
        if(gridValue === 1) {
            content = '<span class="cross">X</span>';
        }
        else if (gridValue === 2) {
            content = '<span class="cross">O</span>';
        }
        if(gridValue > 0 || freeze){
            additionalClass += " greyout";
        }
        rowDivs = rowDivs + '<div colIdx="'+ colIdx +'" rowIdx="' + rowIdx + '" class="box ' +
            additionalClass + '">' + content + '</div>';
    }
    return rowDivs;
}

function getColumns() {
    let columnDivs = '';
    for(let colIdx=0; colIdx < GRID_LENGTH; colIdx++) {
        let coldiv = getRowBoxes(colIdx);
        coldiv = '<div class="rowStyle">' + coldiv + '</div>';
        columnDivs = columnDivs + coldiv;
    }
    return columnDivs;
}

function renderMainGrid() {
    const parent = document.getElementById("grid");
    const columnDivs = getColumns();
    parent.innerHTML = '<div class="columnsStyle">' + columnDivs + '</div>';
}

function onBoxClick() {
    play(this);
    renderMainGrid();
    if(!freeze){
        addClickHandlers();
    }
}

function addClickHandlers() {
    var boxes = document.getElementsByClassName("box");
    for (var idx = 0; idx < boxes.length; idx++) {
        if(!boxes[idx].className.includes('greyout')){
            boxes[idx].addEventListener('click', onBoxClick, false);
        }
    }
}

initializeGrid();
renderMainGrid();
addClickHandlers();

function play(box) {
    //add X for the box player clicked
    //check if the player won
    //freeze and show message
    //change to computer
    //if there are any moves left
        // make a move
        // check if won
            // then show message
    //else - all moves are done
    //  show draw message
    //change back to player

    // player move and update status
    // rowIdx and colIdx is flipped for some reason ???
    var rowIdx = box.getAttribute("rowIdx");
    var colIdx = box.getAttribute("colIdx");
    grid[colIdx][rowIdx] = currentPlayer;
    humanMoves.push([colIdx, rowIdx]);
    numberOfMoves++;
    updateStatus();

    // computer move
    togglePlayer();
    if(!freeze){
        makeMove();
    }

    // switch back to player
    togglePlayer();
}

function updateStatus() {
    if(freeze){
        // don't update anything if frozen
        return;
    }
    if(checkWin()){
        freeze =  true;
        updateMessage("won");
    }
    else if(checkDraw()){
        freeze =  true;
        updateMessage("draw");
    }
    else {
        updateMessage("play");
    }
}

// status = won, draw or play
function updateMessage(message){
    let status = document.getElementsByClassName("status")[0];
    let messages = {
        play: function() {
            return currentPlayer === human ? "Your Move" : "Computer's Move";
        },
        won: function() {
            return currentPlayer === human ? "You Won!!!" : "The Computer Won!!!";
        },
        draw: function() {
            return "It's draw. Refresh to try again";
        }
    }
    status.innerText = messages[message]();
    if(freeze) {
        // make it blink
        status.style.color = "green";
        setInterval(function() {
            status.style.visibility = (status.style.visibility === 'hidden' ? 'visible' : 'hidden');
        }, 300);
    }
}

function togglePlayer() {
    currentPlayer = 3 - (currentPlayer % 3);
    updateStatus();
}


function makeMove() {
    AI.init(grid);
    let bestMove = AI.bestMove();
    grid[bestMove.row][bestMove.col] = computer;
    numberOfMoves++;
    updateStatus();
}

// brute force win checker
// player - 1 : X - Human
// player - 2 : 0 - Computer
function checkWin() {
    AI.init(grid)
    return AI.checkWin(currentPlayer);
}

function checkDraw() {
    return (numberOfMoves === Math.pow(GRID_LENGTH,2));
}

let AI = (function(){
    // private vars
    var board;
    var blank = 0;
    var human = 1;
    var computer = 2;
    var maxScore = 10;
    var minScore = -10;
    var drawScore = 0;
    var currentPlayer;

    function init(grid) {
        board = [];
        // clone each row and push it to board
        for(let row = 0; row < grid.length; row++){
            let rowClone = [...grid[row]];
            board.push(rowClone);
        }
    }

    // checkers - copy from above
    function checkWin(player) {
        currentPlayer = player;
        return (
            checkDiag1() || 
            checkDiag2() ||
            checkRows() || 
            checkColumns()
        );
    }

    function checkRows() {
        for(let row = 0; row < board.length; row++){
            let result = board[row].reduce((acc, val) => acc && val === currentPlayer, true);
            if(result){
                return true
            }
        }
        return false;
    }

    function checkColumns() {
        for(let col = 0; col < board.length; col++){
            let curColResult = true;
            for(let row = 0; row < board.length; row++){
                if( curColResult && board[row][col] !== currentPlayer ){
                    curColResult = false;
                }
            }
            if(curColResult){
                return true;
            }
        }
        return false;
    }

    function checkDiag1() {
        // top left to bottom right
        for(let idx = 0; idx < board.length; idx++){
            if(board[idx][idx] !== currentPlayer){
                return false;
            }
        }
        return true;
    }

    function checkDiag2() {
        // top right to bottom left
        let rowIdx = board.length - 1;
        let colIdx = 0;
        while(rowIdx >= 0){
            if(board[rowIdx][colIdx] !== currentPlayer){
                return false;
            }
            rowIdx--;
            colIdx++;
        }
        return true;
    }

    // returns the position to fill
    function evaluate() {
        // 1 - human - minimizing player
        // 2 - computer - maximizing player
        if(checkWin(human)){
            return minScore;
        }
        
        if(checkWin(computer)){
            return maxScore
        }

        // nobody won
        return drawScore;
    }
    
    function isMovesLeft() {
        for(let i = 0; i < board.length; i++){
            for(let j = 0; j < board.length; j++) {
                if(board[i][j] === blank){
                    return true
                }
            }
        }
        return false
    }

    function findBestMove() {
        let bestVal = -1000; 
        bestMove = {};
        bestMove.row = -1; 
        bestMove.col = -1; 
    
        for (let i = 0; i< board.length; i++) 
        { 
            for (let j = 0; j< board.length; j++) 
            { 
                // Check if cell is empty 
                if (board[i][j] === blank){
                    // Make the move 
                    board[i][j] = computer;
                    // compute evaluation function for this 
                    // move.
                    let moveVal = minimax(0, human); 
    
                    // Undo the move
                    board[i][j] = blank; 
    
                    
                    if (moveVal > bestVal) 
                    { 
                        bestMove.row = i; 
                        bestMove.col = j; 
                        bestVal = moveVal; 
                    } 
                } 
            } 
        }
        return bestMove; 
    }

    //dfs based backtrack algo search which goes through all possibilities
    function minimax(depth, player) {
        console.log(depth, player);
        let score = evaluate(); 
        // if maximizer or minimizer has won
        if (score === maxScore || score === minScore) {
            return score;
        }
        if (!isMovesLeft()){
            return drawScore;
        }
        // If this maximizer's move 
        if (player === computer) {
            let best = -10000;
            for (let i = 0; i < board.length; i++) {
                for (let j = 0; j < board.length; j++) {
                    if (board[i][j] === blank) {
                        // Make the move
                        board[i][j] = computer;
                        // recurse - backtrack
                        best = Math.max( best, minimax(depth+1, human)); 
                        // Undo the move 
                        board[i][j] = blank; 
                    }
                }
            }
            return best;
        }
        else {
            let best = 10000;
            for (let i = 0; i<3; i++) { 
                for (let j = 0; j<3; j++) {
                    if (board[i][j] === blank) {
                        // make the move
                        board[i][j] = human;
                        // recurse backtrack
                        best = Math.min(best, minimax(depth+1, computer)); 
                        // Undo the move 
                        board[i][j] = blank; 
                    }
                }
            }
            return best; 
        }
    }

    return {
        init: init,
        bestMove: findBestMove,
        checkWin: checkWin
    }
})()
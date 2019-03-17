/**
* This program is a boilerplate code for the standard tic tac toe game
* Here the “box” represents one placeholder for either a “X” or a “0”
* We have a 2D array to represent the arrangement of X or O is a grid
* 0 -> empty box
* 1 -> box with X
* 2 -> box with O
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

function getRandom() {
    return Math.floor(Math.random()*GRID_LENGTH);
}

function makeMove() {
    // three ways to implement this
    //1. fill the first non empty block
    //2. fill a block randomly
    //3. smart fill based on some kind of dfs based search 
    customFill();
    numberOfMoves++;
    updateStatus();
}

function firstNonFilledBox(){
    // find the first non filled box and fill it.
    // this is the easiest to implement
    // this should skip all computer rows
    for(let row = 0; row < GRID_LENGTH; row++){
        for(let col = 0; col < GRID_LENGTH; col++){
            if(grid[row][col] === 0){
                grid[row][col] = currentPlayer;
                return;
            }
        }
    }
}

function randomFill(){
    let filled = false;
    let count = 0;
    // if the random has been running for morethan 100
    // use the other approach
    while(!filled){
        let row = getRandom();
        let col = getRandom();
        count++;
        // stop after trying 100 times
        if(count > 100){
            firstNonFilledBox();
            filled = true;
        }
        if(grid[row][col] === 0){
            grid[row][col] = currentPlayer;
            filled = true;
        }
    }
}

function customFill() {
    //smart brute force
    //computer can make only four moves 2,4,6,8
    //i.e if the number of moves made is odd
    //fill any block on row where x is there
    if(numberOfMoves == 1){
        //find the row where x is found
        let row = humanMoves[0][0];
        fillFirstAvailable(row);
        return;
    }
    // fill any availble corners skipping the already handled row & col
    // this should have been block diagonal paths
    else if(numberOfMoves == 3){
        let corners = [[0,0], [0,2], [2,0], [2,2]];
        let compRow = computerMoves[0][0];
        let compCol = computerMoves[0][1];
        for(let i = 0; i < corners.length; i++){
            let row = corners[i][0];
            let col = corners[i][1];
            if(grid[row][col] === 0 && row != compRow && col != compCol){
                grid[row][col] = currentPlayer;
                return;
            }
        }
    }
    // make the other two moves randomly
    else {
        randomFill();
    }
}

function fillFirstAvailable(row){
    for(let col=0; col < GRID_LENGTH; col++){
        if(grid[row][col] === 0){
            computerMoves.push([row,col])
            grid[row][col] = currentPlayer;
            return;
        }
    }
}

function dfsFill() {
    //trying out all paths - probably emulate the full play for both palyers
    //trying all paths will probably take too much time
    //limit based on depth may be
    //take the first winning move from dfs as winning move ?
    //may be block all possible winning paths for X ?
    //blocking all routes will make the game less interesting
}

// brute force win checker
// player - 1 : X - Human
// player - 2 : 0 - Computer
function checkWin() {
    return (
        checkDiag() || 
        checkRows() || 
        checkCols()
    );
}

function checkDiag() {
    // top left to bottom right
    // 00, 11, 22
    let result = true
    for(let idx = 0; idx < GRID_LENGTH; idx++){
        if(grid[idx][idx] !== currentPlayer){
            result = false;
            break;
        }
    }
    if(result) {
        return result;
    }
    // bottom left to top right
    // 20, 11, 02 -1,+1
    let rowIdx = GRID_LENGTH - 1;
    let colIdx = 0;
    while(rowIdx >= 0){
        if(grid[rowIdx][colIdx] !== currentPlayer){
            return false;
        }
        rowIdx--;
        colIdx++;
    }
    return true;
}

function checkRows() {
    for(let row = 0; row < GRID_LENGTH; row++){
        let result = grid[row].reduce((acc, val) => acc && val === currentPlayer, true);
        if(result){
            return true
        }
    }
    return false;
}

function checkCols() {
    for(let col = 0; col < GRID_LENGTH; col++){
        let curColResult = true;
        for(let row = 0; row < GRID_LENGTH; row++){
            if( curColResult && grid[row][col] !== currentPlayer ){
                curColResult = false;
            }
        }
        if(curColResult){
            return true;
        }
    }
    return false;
}

function checkDraw() {
    return (numberOfMoves === Math.pow(GRID_LENGTH,2));
}
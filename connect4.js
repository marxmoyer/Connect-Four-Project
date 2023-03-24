/** Connect Four
 *
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */


const inputHight = document.querySelector("#inputHight")
const inputWidth = document.querySelector("#inputWidth")
const playerturn = document.querySelector("#playerNumber")


let WIDTH = 7;
let HEIGHT = 6;

let currPlayer = 1; // active player: 1 or 2
let board = []; // array of rows, each row is array of cells  (board[y][x])

// makeBoard: create in-JS board structure:
function makeBoard() {
  for(let y = 0; y < WIDTH; y++){
    board.push(Array.from({ length: HEIGHT }));
    
  }
}
 
/** makeHtmlBoard: make HTML table and row of column tops. */
function makeHtmlBoard() {
  const table = document.querySelector("#board")
  
  // Add function the the top row and listens for a click of the top row
  const top = document.createElement("tr");
  top.setAttribute("id", "column-top");
  top.addEventListener("click", handleClick);

  for (let x = 0; x < WIDTH; x++) {
    var headCell = document.createElement("td");
    headCell.setAttribute("id", x);
    top.append(headCell);
  }
  table.append(top);

  // Makes the html
  for (let y = 0; y < HEIGHT; y++) {
    const row = document.createElement("tr");
    for (var x = 0; x < WIDTH; x++) {
      const cell = document.createElement("td");
      cell.setAttribute("id", `${y}-${x}`);
      row.append(cell);
    }
    table.append(row);
  }
}

// makes the div to track whos trun
  const playerCount = document.createElement('div')
  playerCount.classList.add('turn','player1')
  playerturn.append(playerCount)

// updats plyers turn
function upPlayerTurn(){
  playerCount.classList.toggle("player2")
}

/** findSpotForCol: given column x, return top empty y (null if filled) */

function findSpotForCol(x) {
  for (let y = HEIGHT - 1; y >= 0; y--) {
    if(!board ?.[x] ?.[y]){
      return y
    }
  }
  return null
}

/** placeInTable: update DOM to place piece into HTML table of board */
function placeInTable(y, x) {
  const newPiece = document.createElement('div')
  newPiece.classList.add('piece')
  newPiece.classList.add(`player${currPlayer}`)
  
  const place = document.getElementById(`${y}-${x}`)
  place.append(newPiece)
}

/** endGame: announce game end */
function endGame(msg) {
  alert(msg)
}

/** handleClick: handle click of column top to play piece */
function handleClick(evt) {
  // get x from ID of clicked cell
  var x = +evt.target.id;

  // get next spot in column (if none, ignore click)
  var y = findSpotForCol(x);
  if (y === null) {
    return;
  }

  // place piece in board and add to HTML table
  board[x][y] = currPlayer
  placeInTable(y, x);

  // check for win
  if (checkForWin()) {
    return endGame(`Player: ${currPlayer} won!`);
  }

  // check for tie
  // TODO: check if all cells in board are filled; if so call, call endGame
  if (board.every(row => row.every(cell => cell))) {
    return endGame('Tie!');
  } 
  // switch players
  currPlayer = currPlayer === 1 ? 2 : 1
  upPlayerTurn()
}

/** checkForWin: check board cell-by-cell for "does a win start here?" */
function checkForWin() {
  
  function _win(cells) {
    // Check four cells to see if they're all color of current player
    //  - cells: list of four (y, x) cells
    //  - returns true if all are legal coordinates & all match currPlayer

    return cells.every(
      ([y, x]) =>
        y >= 0 &&
        y < HEIGHT &&
        x >= 0 &&
        x < WIDTH &&
        (board?.[y]?.[x]) === currPlayer
    );
  }

  // this bit of code looks at the 2d arr and checks all combnations of win condiction
  for (var y = 0; y < HEIGHT; y++) {
    for (var x = 0; x < WIDTH; x++) {
      var horiz = [[y, x], [y, x + 1], [y, x + 2], [y, x + 3]];
      var vert = [[y, x], [y + 1, x], [y + 2, x], [y + 3, x]];
      var diagDR = [[y, x], [y + 1, x + 1], [y + 2, x + 2], [y + 3, x + 3]];
      var diagDL = [[y, x], [y + 1, x - 1], [y + 2, x - 2], [y + 3, x - 3]];

      if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
        return true;
      }
    }
  }
}

makeBoard();
makeHtmlBoard();

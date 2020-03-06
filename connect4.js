/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */

const WIDTH = 7;
const HEIGHT = 6;

let currPlayer = 1; // active player: 1 or 2
const board = []; // array of rows, each row is array of cells  (board[y][x])

makeBoard();
makeHtmlBoard();

/** makeBoard: create in-JS board structure:
 *    board = array of rows, each row is array of cells  (board[y][x])
 */

 // Creates the board
function makeBoard() {
  // TODO: set "board" to empty HEIGHT x WIDTH matrix array
  while (board.length < HEIGHT){
    let row = [];
    for (let i = 1; i <= WIDTH; i++){
      row.push(null);
    }
    board.push(row);
  }
}

/** makeHtmlBoard: make HTML table and row of column tops. */

function makeHtmlBoard() {
  // TODO: get "htmlBoard" variable from the item in HTML w/ID of "board"
  let htmlBoard = document.getElementById("board");
  // TODO: add comment for this code
  // create table row in HTML with ID of "column-top" and adding event listener of "click"
  let top = document.createElement("tr");
  top.setAttribute("id", "column-top");
  top.addEventListener("click", handleClick);
  // adding divs to row at top of board with an id of the x-coordinate
  for (let x = 0; x < WIDTH; x++) {
    let headCell = document.createElement("td");

    headCell.setAttribute("id", x);
    top.append(headCell);
  }
  // adding top row to board
  htmlBoard.append(top);

  // TODO: add comment for this code
  // creating playable space with coodinate IDs (y-x) for each cell... (0,0) in top left
  for (let y = 0; y < HEIGHT; y++) {
    let row = document.createElement("tr");
    
    for (let x = 0; x < WIDTH; x++) {
      let cell = document.createElement("td");
      
      cell.setAttribute("id", `${y}-${x}`);
      row.append(cell);
    }
    htmlBoard.append(row);
  }
}

/** findSpotForCol: given column x, return top empty y (null if filled) */
// given the xCoOrdinate return yCoOrd of last empty cell while checking downward
// else return null

function findSpotForCol(x) {
  // TODO: write the real version of this, rather than always returning 0
  // first click of every column errors but still playable
  for (let i = board.length-1 ;i >= 0; i--){
    if(board[i][x] === null){
      return i;
    }
  }
  return null;
}

/** placeInTable: update DOM to place piece into HTML table of board */

function placeInTable(y, x) {
  // TODO: make a div and insert into correct table cell
  let gamePiece = document.createElement("div");
  
  gamePiece.classList.add("piece");
  let classToAdd = currPlayer === 1 ? "p1" : "p2"
  gamePiece.classList.add(classToAdd)
  // if (currPlayer === 1){
  //   gamePiece.classList.add("p1");
  // }else{
  //   gamePiece.classList.add("p2");
  // }
  document.getElementById(`${y}-${x}`).appendChild(gamePiece);
}

/** endGame: announce game end */

function endGame(msg) {
  // TODO: pop up alert message

  setTimeout(function(){
    alert(msg)
    let button = document.createElement("input");
    button.id = "start-over-button";
    button.value = "start a new game";
    button.type = "button";
    document.getElementById("game-over").append(button);
    button.addEventListener("click", function(){
      window.location.reload();
    })
  }, 250);
}

/** handleClick: handle click of column top to play piece */

function handleClick(evt) {
  // get x from ID of clicked cell
  const xCoOrdinate = +evt.target.id;

  // get next spot in column (if none, ignore click)
  let yCoOrdinate = findSpotForCol(xCoOrdinate);
  
  if (yCoOrdinate === null) {
    return;
  }

  // place piece in board and add to HTML table
  // TODO: add line to update in-memory board

  board[yCoOrdinate][xCoOrdinate] = currPlayer;
  placeInTable(yCoOrdinate, xCoOrdinate);

  // check for win
  if (checkForWin()) {
    return endGame(`Player ${currPlayer} won!`);
  }

  // check for tie
  // TODO: check if all cells in board are filled; if so call, call endGame

  if(board.every((subArray) => subArray.every((element) => element !== null))){
    return endGame("board full!");
  }
  // switch players
  // TODO: switch currPlayer 1 <-> 2
  currPlayer === 2 ? currPlayer = 1 : currPlayer = 2
}

/** checkForWin: check board cell-by-cell for "does a win start here?" */

function checkForWin() {
  // define a win
  function _win(cells) {
    // Check four cells to see if they're all color of current player
    //  - cells: list of four (y, x) cells
    //  - returns true if all are legal coordinates & all match currPlayer

    // if the y and x coordinates are vaild playable coordinates within the grid return true else return false
    return cells.every(
      ([y, x]) =>
        y >= 0 &&
        y < HEIGHT &&
        x >= 0 &&
        x < WIDTH &&
        board[y][x] === currPlayer
    );
  }

  // TODO: read and understand this code. Add comments to help you.
  // determining a win with four of the same pieces vertically, horizonally, diagDR, diagDL
  for (let y = 0; y < HEIGHT; y++) {
    for (let x = 0; x < WIDTH; x++) {
      let horiz = [[y, x], [y, x + 1], [y, x + 2], [y, x + 3]];
      let vert = [[y, x], [y + 1, x], [y + 2, x], [y + 3, x]];
      let diagDR = [[y, x], [y + 1, x + 1], [y + 2, x + 2], [y + 3, x + 3]];
      let diagDL = [[y, x], [y + 1, x - 1], [y + 2, x - 2], [y + 3, x - 3]];

      if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
        return true;
      }
    }
  }
}



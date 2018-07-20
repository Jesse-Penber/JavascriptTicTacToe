var origBoard;
const huPlayer = '0';
const aiPlayer = 'X';

//array containing all winning combinations of squares
const winCombos = [        
	[0, 1, 2],
	[3, 4, 5],
	[6, 7, 8],
	[0, 3, 6],
	[1, 4, 7],
	[2, 5, 8],
	[0, 4, 8],
	[6, 4, 2]
]

const cells = document.querySelectorAll('.cell');
startGame();

function startGame () {
	// gets rid of orange box when you click replay button
	document.querySelector(".endgame").style.display = "none";
	// creates array of values from 0 to 8 for other array
	origBoard = Array.from(Array(9).keys());
	console.log(origBoard);
	
	for (var i = 0; i < cells.length; i++) {
		cells[i].innerText = '';
		cells[i].style.removeProperty('background-color');
		cells[i].addEventListener('click', turnClick, false);
	}
}

function turnClick(square) {
	if (typeof origBoard[square.target.id] == 'number') { //checks if spot clicked already full 
		turn(square.target.id, huPlayer);
		if (!checkTie()) turn(bestSpot(), aiPlayer); //if spots not all full, AI takes turn 	
	}
}

function turn(squareId, player) {
	origBoard[squareId] = player;
	document.getElementById(squareId).innerText = player;
	let gameWon = checkWin(origBoard, player);
	if (gameWon) gameOver(gameWon);
}

function checkWin(board, player) {
	let plays = board.reduce((a, e, i) => //finds the squares that have been played in. a is accumulator, e is element, i is index
	(e === player) ? a.concat(i) : a, []);	//accumulator. Adds i to a if e equals player
	let gameWon = null;
	for (let [index, win] of winCombos.entries()) { 
		if (win.every(elem => plays.indexOf(elem) > -1)) { //if every win spot has been played in 
			gameWon = {index: index, player: player}; // shows which player has won and which combo has won
			break;
		}
	}
	return gameWon;
}

function gameOver (gameWon) {
	for (let index of winCombos[gameWon.index]) { //selects index of winning combo 
		document.getElementById(index).style.backgroundColor =   //changes background color 
		gameWon.player == huPlayer ? "blue" : "red";
	}
	for (var i = 0; i < cells.length; i++) {
		cells[i].removeEventListener('click', turnClick, false
		
		); //prevents user from clicking further squares 
	}
	declareWinner(gameWon.player == huPlayer ? "You win!" : "You lose!");
}

function declareWinner(who) {
	document.querySelector(".endgame").style.display = "block"; //shows endgame section
	document.querySelector(".endgame .text").innerText = who;
}

function emptySquares() {
	return origBoard.filter(s => typeof s == 'number');
}

function bestSpot() {
	return emptySquares()[0];
}

function checkTie() {
	if (emptySquares().length == 0) {
		for (var i = 0; i < cells.length; i++) {
			cells[i].style.backgroundColor = "green";
			cells[i].removeEventListener('click', turnClick, false);
		}
		declareWinner("Tie Game!")
		return true;
	}
	return false;
}
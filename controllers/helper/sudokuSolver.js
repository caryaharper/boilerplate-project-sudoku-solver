const options = () => {
	const oneThruNine = {};
	for (let i = 1; i < 10; i++) oneThruNine[i] = true;
	return oneThruNine
}

const areaOps = (row, col, board) => {
	const ops = options();
  
	//rowStart is the start of row given the area
	//if the row of an element was the 2nd array then the row start
	//would be 0 => Math.floor(1 / 3) * 3 === 0
	let rowStart = Math.floor(row / 3) * 3;
	let colStart = Math.floor(col / 3) * 3;
	
	for (let i = rowStart; i < rowStart + 3; i++) {
		for (let j = colStart; j < colStart + 3; j++) {
			const ele = board[i][j];
			if (ele === 0) continue;
			ops[ele] = false;
		}
	}
	
	return ops;
}

const rowOps = (row, board) => {
	const ops = options();
	
	for (let i = 0; i < 9; i++) {
		const ele = board[row][i];
		if (ele === 0) continue;
		ops[ele] = false;
	}
	
	return ops
}

const colOps = (col, board) => {
	const ops = options();
	
	for (let i = 0; i < 9; i++) {
		const ele = board[i][col];
		if (ele === 0) continue;
		ops[ele] = false;
	}
	
	return ops;
}

//returns an array of possible solutions for a given spot with
//the current board state
//an empty array would mean there are no possible 
//solutions with the given board state
const posSol = (row, col, board) => {
	const areaPos = areaOps(row, col, board);
	const rowPos = rowOps(row, board);
	const colPos = colOps(col, board);
	const possibilities = []
	
	for (let i = 1; i < 10; i++) {
		if (areaPos[i] && rowPos[i] && colPos[i]) possibilities.push(i); 
	}
	
	return possibilities;
}

function solveSudoku(board, row = null, col = null) {
  if (row !== null && col !== null) {
		const pos = posSol(row, col, board);
		
		for (let i = 0; i < pos.length; i++) {
			board[row][col] = pos[i];
			const result = solveSudoku(board);
			
			if (Array.isArray(result)) {
				return result;
			}
		}
		board[row][col] = 0;
		return 'invalid board';
	}
  
	for (let i = 0; i < board.length; i++) {
		for (let j = 0; j < board[i].length; j++) {
			if (board[i][j] === 0) {
				return solveSudoku(board, i, j);
			}
		}
	}
	
	return board;
}


module.exports = solveSudoku;
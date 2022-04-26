const rowStarHelper = require('./helper/rowStartHelper.js');
const colStartHelper = require('./helper/colStartHelper.js');
const stringToMatrix = require('./helper/stringToMatrix.js');
const solveSudoku = require('./helper/sudokuSolver.js');
const matrixToString = require('./helper/matrixToString');

const rowStart = {
  a: 0,
  b: 9,
  c: 18,
  d: 27,
  e: 36,
  f: 45,
  g: 54,
  h: 63,
  i: 72,
}

class SudokuSolver {

  validatePuzzle({puzzle}) {
    if (puzzle.length === 0) {
      throw Error('Required field missing');
    }
    
    if (puzzle.length !== 81) {
      throw Error('Expected puzzle to be 81 characters long');
    }

    for (const char of puzzle) {
      if (char === '0' || (char !== '.' && !Number.isInteger(Number(char)))) {
        throw Error('Invalid characters in puzzle');
      }
    }
  }

  validateCheckReq ({puzzle, coordinate, value}) {
    if (!puzzle || !coordinate || !value) {
      throw Error('Required field(s) missing');
    }
  }

  /**
   *all check methods ignore the coordinate given
  */
  checkRowPlacement({puzzle, coordinate, value}) {
    const row = coordinate[0].toLowerCase();
    const position = rowStart[row] + (Number(coordinate[1]) - 1);
    
    const start = rowStart[row];
    const end = start + 9;

    for (let i = start; i < end; i++) {
      //skips the column of the coordinate
      if (i === position) {
        continue;
      }
      
      if (puzzle[i] === value) {
        return false;
      }
    }
    return true;
  }

  checkColPlacement({puzzle, coordinate, value}) {
    const row = coordinate[0].toLowerCase();
    const col = Number(coordinate[1]);
    if (col < 1 || col > 9) {
      return false;
    } 

    const start = col - 1;
    const position = rowStart[row] + (col - 1);

    for (let i = start; i < puzzle.length; i += 9) {
      //skips the row of the coordinate
      if (i === position) {
        continue;
      }
      
      if (puzzle[i] === value) {
        return false;
      }
    }
    return true;
  }

  checkRegionPlacement({puzzle, coordinate, value}) {
    const row = coordinate[0].toLowerCase();
    const col = Number(coordinate[1]);

    const rowStartIndex = rowStarHelper(row, rowStart[row]);
    const colStartIndex = colStartHelper(col) - 1;
    const position = rowStart[row] + (col - 1);

    for (let i = rowStartIndex; i < rowStartIndex + 27; i += 9) {
      for (let j = colStartIndex; j < colStartIndex + 3; j++) {
        if (i + j === position) {
          continue;
        }
        
        if (puzzle[i + j] === value) {
          return false;
        }
      }
    }

    return true;
  }

  checkPlacement(puzzleObj) {
    this.validateCheckReq(puzzleObj);
    this.validatePuzzle(puzzleObj);

    const value = Number(puzzleObj.value);
    if (value < 1 || value > 9 || Number.isNaN(value)) {
      throw Error('Invalid value');
    }
    
    const row = puzzleObj.coordinate[0].toLowerCase();
    const col = Number(puzzleObj.coordinate.slice(1));
    if (
      !(row in rowStart) || 
      (col < 1 || col > 9 || Number.isNaN(col))
    ) {
      throw Error('Invalid coordinate');
    }

    const rowPlacement = this.checkRowPlacement(puzzleObj);
    const colPlacement = this.checkColPlacement(puzzleObj);
    const regionPlacement = this.checkRegionPlacement(puzzleObj);

    if (rowPlacement && colPlacement && regionPlacement) {
      return { valid: true };
    }

    const invalid = { valid: false, conflict: [] };

    if (!rowPlacement) {
      invalid.conflict.push('row');
    }

    if (!colPlacement) {
      invalid.conflict.push('column');
    }

    if (!regionPlacement) {
      invalid.conflict.push('region');
    }

    return invalid;
  }

  solve(puzzleString) {
    //if the method returns 1 the puzzle cannot be solved
    const board = stringToMatrix(puzzleString);
    const result = solveSudoku(board);

    if (Array.isArray(result)) {
      return matrixToString(result);
    }

    return 1;
  }
}

module.exports = SudokuSolver;


const chai = require('chai');
const assert = chai.assert;

const {puzzlesAndSolutions} = require('../controllers/puzzle-strings.js');
const [toSolve, solution] = puzzlesAndSolutions[0];

const Solver = require('../controllers/sudoku-solver.js');
let solver = new Solver;

const testPuzObj = {
  puzzle: toSolve,
  coordinate: null,
  value: null,
}

suite('UnitTests', () => {
  test('Logic handles a valid puzzle string of 81 characters', () => {
    assert.isUndefined(solver.validatePuzzle(testPuzObj));
  });

  test('Logic handles a puzzle string with invalid characters (not 1-9 or .)', () => {
    const invalidChar = '105..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';
    testPuzObj.puzzle = invalidChar;

    assert.throws(
      () => solver.validatePuzzle(testPuzObj), 
      Error, 
      'Invalid characters in puzzle'
    );
  });

  test('Logic handles a puzzle string that is not 81 characters in length', () => {
    testPuzObj.puzzle = '123';

    assert.throws(
      () => solver.validatePuzzle(testPuzObj),
      Error,
      'Expected puzzle to be 81 characters long'
    );
  });

  //COORDINATE FOR ALL PLACEMENT TEST IS a2
  //THE PUZZLE IN THE TEST IS toSolve
  test('Logic handles a valid row placement', () => {
    testPuzObj.puzzle = toSolve;
    testPuzObj.coordinate = 'a2';
    testPuzObj.value = '6';

    assert.strictEqual(solver.checkRowPlacement(testPuzObj), true);
  });

  test('Logic handles an invalid row placement', () => {
    testPuzObj.value = '5';

    assert.strictEqual(solver.checkRowPlacement(testPuzObj), false);
  });

  test('Logic handles a valid column placement', () => {
    testPuzObj.value = '3';

    assert.strictEqual(solver.checkColPlacement(testPuzObj), true);
  });

  test('Logic handles a invalid column placement', () => {
    testPuzObj.value = '9';

    assert.strictEqual(solver.checkColPlacement(testPuzObj), false);
  });

  test('Logic handles a valid region (3x3 grid) placement', () => {
    testPuzObj.value = '4';

    assert.strictEqual(solver.checkRegionPlacement(testPuzObj), true);
  });

  test('Logic handles a invalid region (3x3 grid) placement', () => {
    testPuzObj.value = '5';

    assert.strictEqual(solver.checkRegionPlacement(testPuzObj), false);
  });
  //END OF PLACEMENT TEST

  test('Valid puzzle strings pass the solver', () => {
    assert.strictEqual(solver.solve(toSolve), solution);
    assert.strictEqual(solver.solve(solution), solution);
  });

  test('Invalid puzzle strings fail the solver', () => {
    const invalidPuz = '155..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';

    assert.strictEqual(solver.solve(invalidPuz), 1);
  });

  test('Solver returns the expected solution for an incomplete puzzle', () => {
    assert.strictEqual(solver.solve(toSolve), solution);

    const invalidPuz = '155..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';

    assert.strictEqual(solver.solve(invalidPuz), 1);
  })
});

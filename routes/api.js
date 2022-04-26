'use strict';

const SudokuSolver = require('../controllers/sudoku-solver.js');

module.exports = function (app) {
  
  let solver = new SudokuSolver();

  app.route('/api/check')
    .post((req, res) => {

      try {
        res.json(solver.checkPlacement(req.body));
      } catch(e) {
        res.json({ error: e.message });
        return;
      }
      
    });
    
  app.route('/api/solve')
    .post((req, res) => {
      const {puzzle} = req.body;
      
      if (puzzle === undefined) {
        res.json({ error: 'Required field missing' });
        return;
      }

      if (typeof puzzle !== 'string') {
        res.json({ error: 'Required field type must be string'});
        return;
      }

      try {
        solver.validatePuzzle(req.body);
      } catch(e) {
        res.json({ error: e.message});
        return;
      }  
      const solution = solver.solve(puzzle);

      if (solution === 1) {
        res.json({ error: 'Puzzle cannot be solved' });
        return;
      }
      
      res.json({solution});
      return;
    });
};

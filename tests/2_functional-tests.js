const chai = require("chai");
const chaiHttp = require('chai-http');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', () => {
  const incompValidPuz = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';
  const compValidPuz = '135762984946381257728459613694517832812936745357824196473298561581673429269145378';
  
  test('Solve a puzzle with valid puzzle string: POST request to /api/solve', (done) => {
    chai
      .request(server)
      .post('/api/solve')
      .send({ puzzle: incompValidPuz })
      .end((err, res) => {
        assert.strictEqual(res.status, 200);
        const resObj = JSON.parse(res.res.text);
        assert.strictEqual(resObj.solution, compValidPuz);
        done();
      });
  })

  test('Solve a puzzle with missing puzzle string: POST request to /api/solve', (done) => {
    chai
      .request(server)
      .post('/api/solve')
      .send({ puzzle: '' })
      .end((err, res) => {
        assert.strictEqual(res.status, 200);
        const resObj = JSON.parse(res.res.text);
        assert.strictEqual(resObj.error, 'Required field missing');
        done();
      });
  })

  test('Solve a puzzle with invalid characters: POST request to /api/solve', (done) => {
    chai
      .request(server)
      .post('/api/solve')
      .send({ puzzle: '?'.repeat(81) })
      .end((err, res) => {
        assert.strictEqual(res.status, 200);
        const resObj = JSON.parse(res.res.text);
        assert.strictEqual(resObj.error, 'Invalid characters in puzzle');
        done();
      });
  })

  test('Solve a puzzle with incorrect length: POST request to /api/solve', (done) => {
    chai
      .request(server)
      .post('/api/solve')
      .send({ puzzle: '1234' })
      .end((err, res) => {
        assert.strictEqual(res.status, 200);
        const resObj = JSON.parse(res.res.text);
        assert.strictEqual(resObj.error, 'Expected puzzle to be 81 characters long');
        done();
      });
  })

  test('Solve a puzzle that cannot be solved: POST request to /api/solve', (done) => {
    const invalidPuz = '115..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';
    
    chai
      .request(server)
      .post('/api/solve')
      .send({ puzzle: invalidPuz })
      .end((err, res) => {
        assert.strictEqual(res.status, 200);
        const resObj = JSON.parse(res.res.text);
        assert.strictEqual(resObj.error, 'Puzzle cannot be solved');
        done();
      });
  })

  test('Check a puzzle placement with all valid fields: POST request to /api/check', (done) => {
    const data = {
      puzzle: incompValidPuz,
      coordinate: 'a2',
      value: '3',
    }
    
    chai
      .request(server)
      .post('/api/check')
      .send(data)
      .end((err, res) => {
        assert.strictEqual(res.status, 200);
        const resObj = JSON.parse(res.res.text);
        assert.strictEqual(resObj.valid, true);
        done();
      });
  })

  test('Check a puzzle placement with single placement conflict: POST request to /api/check', (done) => {
    const badValues = [['3', 'row'], ['9', 'column'], ['5', 'region']]
    
    badValues.forEach(ele => {
      const data = {
              puzzle: incompValidPuz,
              coordinate: 'b2',
              value: ele[0],
            };
      
      chai
      .request(server)
      .post('/api/check')
      .send(data)
      .end((err, res) => { 
        assert.strictEqual(res.status, 200);
        const resObj = JSON.parse(res.res.text);
        assert.strictEqual(resObj.valid, false);
        assert.isArray(resObj.conflict);
        assert.lengthOf(resObj.conflict, 1);
        assert.strictEqual(resObj.conflict[0], ele[1]);
      });
    })
    done();
  })

  test('Check a puzzle placement with multiple placement conflicts: POST request to /api/check', (done) => {
    const badValues = [
      ['2', 'row', 'column'],
      ['4', 'row', 'region'],
      ['8', 'column', 'region']
    ];
    
    badValues.forEach(ele => {
      const data = {
              puzzle: incompValidPuz,
              coordinate: 'i6',
              value: ele[0],
            };
      
      chai
      .request(server)
      .post('/api/check')
      .send(data)
      .end((err, res) => { 
        assert.strictEqual(res.status, 200);
        const resObj = JSON.parse(res.res.text);
        assert.strictEqual(resObj.valid, false);
        assert.isArray(resObj.conflict);
        assert.lengthOf(resObj.conflict, 2);
        assert.strictEqual(resObj.conflict[0], ele[1]);
        assert.strictEqual(resObj.conflict[1], ele[2]);
      });
    })
    done();
  })

  test('Check a puzzle placement with all placement conflicts: POST request to /api/check', (done) => {
    const data = {
      puzzle: incompValidPuz,
      coordinate: 'a2',
      value: '2',
    }
    
    chai
      .request(server)
      .post('/api/check')
      .send(data)
      .end((err, res) => {
        assert.strictEqual(res.status, 200);
        const resObj = JSON.parse(res.res.text);
        assert.strictEqual(resObj.valid, false);
        assert.isArray(resObj.conflict);
        assert.lengthOf(resObj.conflict, 3);
        assert.strictEqual(resObj.conflict[0], 'row');
        assert.strictEqual(resObj.conflict[1], 'column');
        assert.strictEqual(resObj.conflict[2], 'region');
        done();
      });
  })

  test('Check a puzzle placement with missing required fields: POST request to /api/check', (done) => {
    const data = {
      puzzle: '',
      coordinate: 'a2',
      value: '',
    }
    
    chai
      .request(server)
      .post('/api/check')
      .send(data)
      .end((err, res) => {
        assert.strictEqual(res.status, 200);
        const resObj = JSON.parse(res.res.text);
        assert.strictEqual(resObj.error, 'Required field(s) missing');
        done();
      });
  })

  test('Check a puzzle placement with invalid characters: POST request to /api/check', (done) => {
    const data = {
      puzzle: '?'.repeat(81),
      coordinate: 'a2',
      value: '2',
    }
    
    chai
      .request(server)
      .post('/api/check')
      .send(data)
      .end((err, res) => {
        assert.strictEqual(res.status, 200);
        const resObj = JSON.parse(res.res.text);
        assert.strictEqual(resObj.error, 'Invalid characters in puzzle');
        done();
      });
  })

  test('Check a puzzle placement with incorrect length: POST request to /api/check', (done) => {
    const data = {
      puzzle: '246',
      coordinate: 'a2',
      value: '2',
    }
    
    chai
      .request(server)
      .post('/api/check')
      .send(data)
      .end((err, res) => {
        assert.strictEqual(res.status, 200);
        const resObj = JSON.parse(res.res.text);
        assert.strictEqual(resObj.error, 'Expected puzzle to be 81 characters long');
        done();
      });
  })

  test('Check a puzzle placement with invalid placement coordinate: POST request to /api/check', (done) => {
    const data = {
      puzzle: incompValidPuz,
      coordinate: 'j2',
      value: '2',
    }
    
    chai
      .request(server)
      .post('/api/check')
      .send(data)
      .end((err, res) => {
        assert.strictEqual(res.status, 200);
        const resObj = JSON.parse(res.res.text);
        assert.strictEqual(resObj.error, 'Invalid coordinate');
        done();
      });
  })

  test('Check a puzzle placement with invalid placement value: POST request to /api/check', (done) => {
    const data = {
      puzzle: incompValidPuz,
      coordinate: 'a2',
      value: '?',
    }
    
    chai
      .request(server)
      .post('/api/check')
      .send(data)
      .end((err, res) => {
        assert.strictEqual(res.status, 200);
        const resObj = JSON.parse(res.res.text);
        assert.strictEqual(resObj.error, 'Invalid value');
        done();
      });
  })
});


//finds left most column of a region
//STARTS FROM 1 NOT 0

const colStartHelper = col => {
    if ((col + 2) % 3 === 0) {
      return col;
    }
  
    if ((col + 1) % 3 === 0) {
      return col - 1;
    }
  
    return col - 2;
  }
  
  module.exports = colStartHelper;
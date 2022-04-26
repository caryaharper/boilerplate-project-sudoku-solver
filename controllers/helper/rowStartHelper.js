//determines top row of a region

const rowStartHelper = (row, rowVal) => {
    const val = row.charCodeAt();
    if ((val - 1) % 3 === 0) {
      return rowVal;
    }
  
    if ((val - 2) % 3 === 0) {
      return rowVal - 9;
    }
  
    return rowVal - 18;
  }
  
  module.exports = rowStartHelper;
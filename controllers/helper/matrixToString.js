const matrixToStr = (matrix) => {
    let str = '';
    
    for (const arr of matrix) {
        for (const int of arr) {
            str += int
        }
    }

    return str;
}

module.exports = matrixToStr;
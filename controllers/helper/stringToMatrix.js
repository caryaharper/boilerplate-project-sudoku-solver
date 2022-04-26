//formats a string of shape '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.'
//to a matrix that can be handed to sudukoSolver

const stringToMatrix = sudukoStr => {
    const matrix = [];
    let subArr = [];

    for (const char of sudukoStr) {
        if (char === '.') {
            subArr.push(0);
        }
        if (char !== '.') {
            subArr.push(Number(char));
        }
        if (subArr.length === 9) {
            matrix.push(subArr);
            subArr = [];
        }
    }

    return matrix;
}

module.exports = stringToMatrix;
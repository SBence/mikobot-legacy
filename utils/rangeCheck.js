module.exports = (number, min, max) => {
    if (isNaN(number)) {
        return false;
    } else if (number < min || number > max) {
        return false;
    }
    return true;
};

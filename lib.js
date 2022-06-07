function generateShortId() {
    let MAX_VALUE = 999999999;
    let MIN_VALUE = 100000000;

    return (Math.floor(Math.random() * MAX_VALUE) + MIN_VALUE).toString(36)
}

module.exports = {
    generateShortId
}
function choice(array) {
    // randomly pick a element from the array
    return array[Math.floor(Math.random() * array.length)]
}

module.exports = choice
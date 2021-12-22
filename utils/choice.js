function choice(array) {
    /**
    * Randomly pick an element from the given array
    */
    return array[Math.floor(Math.random() * array.length)]
}

module.exports = choice

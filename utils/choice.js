/**
* Randomly pick an element from the given array
* @param {any[]} array The array containing the elements to pick
* @return {any} The random element inside the given array
*/
function choice(array) {
    return array[Math.floor(Math.random() * array.length)]
}

module.exports = choice

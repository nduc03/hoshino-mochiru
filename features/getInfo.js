const members = require('../info/ivi_members')

function getInfo(who) {
    console.log('who:' + who)
    var userId = null
    if (who === undefined) {
        return undefined
    }
    if (who.startsWith('<@!') && who.endsWith('>')) {
        userId = who.substring(3, who.length - 1)
    }
    else if (who.startsWith('<@') && who.endsWith('>')) {
        userId = who.substring(2, who.length - 1)
    }
    console.log('userId: ' + userId)
    return members[userId] || null
}

module.exports = getInfo;
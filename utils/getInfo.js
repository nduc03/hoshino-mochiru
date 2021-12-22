const members = require('../constants/ivi_members_info')

function getInfo(who) {
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
    return members[userId] || null
}

module.exports = getInfo;
const members = require('../constants/ivi_members_info')


/**
 * Get a list of members info
 * @param {string} who Discord format message of user type. https://discord.com/developers/docs/reference#message-formatting
 * @return {string[] | undefined | null}
 * If no error, return the list info of the user (type string[]).
 * If error, there are 2 cases of returning undefined or null:
 * - ```undefined``` will be returned if param who is undefined
 * - ```null``` will be returned if member info is not available or not yet appear.
*/
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
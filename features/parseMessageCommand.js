function parseMessageCommand(message) {
    // Function explain:
    // Step 1: Split message into list of word
    // then filter the blank words (filter when user intentionally add more space unnecessarily)
    // Example: 
    // if user send: "  !info   @user   "
    // then --split--> ['','','!info','','','@user','','']
    // then --filter--> ['!info','@user']
    return message.split(' ').filter(args => args !== '')
}

module.exports = parseMessageCommand
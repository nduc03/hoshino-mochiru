const { SlashCommandBuilder } = require('@discordjs/builders')
const choice = require('../utils/choice')
const members_info = require('../constants/ivi_members_info')
const Constants = require('../constants/constants')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('info')
        .setDescription('Get info about someone in this server.')
        .addMentionableOption(option =>
            option.setName('who')
                .setDescription('Show information about someone in this server.')
                .setRequired(true)),
    members: members_info,
    async execute(interaction) {
        const mention = interaction.options.getMentionable('who')

        var mentionId = mention.id
        if (mentionId == Constants.NDUC_CLONE_1_ID || mentionId == Constants.NDUC_CLONE_2_ID) {
            // changing nduc clone id to nduc main id.
            mentionId = Constants.NDUC_MAIN_ID
        }
        if (!Object.keys(this.members).includes(mentionId)) {
            await interaction.reply('Sorry, I don\'t know anything about this person 😥')
            return
        }
        const userFiles = this.members[mentionId]
        await interaction.reply({ files: [choice(userFiles)] })
    }
}

// nduc id: 730442930317295667
// hydro id: 603506144069156885
// sieben id: 605260827909554177
// flop id: 870569165310816326
// self id = process.env.CLIENT_ID
// nduc nick 2: 702063196420177981
// nick clone: 832626547357122562
// ì v í (role): 846042793730375740
const { SlashCommandBuilder } = require('@discordjs/builders')
const Constants = require('../constants')

module.exports = {
data: new SlashCommandBuilder()
    .setName('archive')
    .setDescription('See server archive'),
    async execute(interaction) {
        interaction.member.roles.add(Constants.ARCHIVE_ROLE_ID)
        await interaction.reply({ content: 'Added archive role.', ephemeral: true })
    }
}
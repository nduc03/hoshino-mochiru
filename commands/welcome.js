const { SlashCommandBuilder } = require('@discordjs/builders')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('welcome')
        .setDescription('Change the welcome channel.')
        .addChannelOption(option =>
            option.setName('set_channel')
                .setDescription('Enter channel name here.')
                .setRequired(true)
        )
}

// Special command does not have execute method.
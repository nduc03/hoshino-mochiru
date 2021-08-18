const { SlashCommandBuilder } = require('@discordjs/builders')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('send')
        .setDescription('Send your message through this bot!')
        .addStringOption(option =>
            option.setName('message')
                .setDescription('Enter your message here')
                .setRequired(true))
    , async execute(interaction) {
        await interaction.reply(`${interaction.member.user.username} said: ${interaction.options.getString('message')} (guild: ${interaction.guild})`)
    }
}

// Command help: If you want to send emoji please enter :<emoji_name>: (emojis have to separate with other words)
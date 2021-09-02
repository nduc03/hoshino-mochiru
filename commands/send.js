const { SlashCommandBuilder } = require('@discordjs/builders')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('send')
        .setDescription('Send your message through this bot!')
        .addStringOption(option =>
            option.setName('message')
                .setDescription('Enter your message here')
                .setRequired(true))
        .addBooleanOption(option =>
            option.setName('no_mention')
            .setDescription('Send message anonymously.'))
    , async execute(interaction) {
        const message = interaction.options.getString('message')
        const no_mention = interaction.options.getBoolean('no_mention')
        const sentence = message.split(' ')
        const all_emojis = interaction.guild.emojis.cache
        for (let word of sentence) {
            if (word.startsWith(':') && word.endsWith(':')) {
                const get_emoji = all_emojis.find(emoji => {
                    return emoji.name == word.substring(1, word.length - 1) && emoji.animated
                })
                if (get_emoji !== undefined) {
                    sentence[sentence.indexOf(word)] = get_emoji
                }
            }
        }
        var reply = sentence.join(' ')
        if (!no_mention) {
            reply = `**${interaction.user.username}** wants to say: ` + reply
        }

        await interaction.channel.send(reply)
        await interaction.reply({ content: `You've just sent: ${sentence.join(' ')}`, ephemeral: true })
    }
}

// Command help: If you want to send emoji please enter :<emoji_name>: (emojis have to separate with other words)

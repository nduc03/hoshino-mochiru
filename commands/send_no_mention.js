const { SlashCommandBuilder } = require('@discordjs/builders')
const { Permissions } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('send_nm')
        .setDescription('Still /send but no mention (admin only)')
        .addStringOption(option =>
            option.setName('message')
                .setDescription('Enter your message here')
                .setRequired(true)),
    async execute(interaction) {
        const permissions = await interaction.member.permissions
        if (!permissions.has(Permissions.FLAGS.ADMINISTRATOR)) {
            await interaction.reply({
                content: `Huh, you're not my papa or my mama <a:freeze:874296954392293406>, please do not use this command <a:no:889604349628661840>`,
                ephemeral: true
            })
            return
        }
        const message = interaction.options.getString('message')
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

        await interaction.channel.send(reply)
        await interaction.reply({ content: `You've just sent: ${sentence.join(' ')}`, ephemeral: true })
    }
}
const { SlashCommandBuilder } = require('@discordjs/builders')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('send_nm')
        .setDescription('Still /send but no mention')
        .addStringOption(option =>
            option.setName('message')
                .setDescription('Enter your message here')
                .setRequired(true)),
    async execute(interaction) {
        const role = await interaction.member.roles.cache
        if (!role.has('846042793730375740')) {// check if the role is ì v í
            await interaction.reply({
                content: 'No mention is only available for ì v í members, please contact server op to get this privilege <:ivi:868334824539185162>',
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
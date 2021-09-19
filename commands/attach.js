const { SlashCommandBuilder } = require('@discordjs/builders')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('attach')
        .setDescription('Send file (beta) - currently this feature only work with cdn.discordapp.com')
        .addStringOption(option =>
            option.setName('link')
                .setDescription('https://cdn.discordapp.com link')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('message')
                .setDescription('Optional message')
                .setRequired(false)),
    async execute(interaction) {
        const link = interaction.options.getString('link')
        const message = interaction.options.getString('message')
        const role = await interaction.member.roles.cache
        if (!role.has('846042793730375740')) {// check if the role is ì v í
            await interaction.reply({
                content: 'Sending attachment is only available for ì v í members, please contact server op to get this privilege <:ivi:868334824539185162>',
                ephemeral: true
            })
            return
        }
        if (!link.includes('https://cdn.discordapp.com')) {
            await interaction.reply({
                content: 'Sorry, this feature currently only works with **https://cdn.discordapp.com**',
                ephemeral: true
            })
            return
        }
        if (message) {
            await interaction.reply({ content: `You're sending a attachment with message "${message}".`, ephemeral: true })
            await interaction.channel.send({ content: message, files: [link] })
        }
        else {
            await interaction.reply({ content: `Attachment is sending.`, ephemeral: true })
            await interaction.channel.send({ files: [link] })
        }
    }
}
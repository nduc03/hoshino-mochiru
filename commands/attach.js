const { SlashCommandBuilder } = require('@discordjs/builders')
const { Permissions } = require('discord.js')

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
        const permissions = await interaction.member.permissions
        if (!permissions.has(Permissions.FLAGS.ADMINISTRATOR)) {
            await interaction.reply({
                content: 'Sorry, this command is only available for administrators.',
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
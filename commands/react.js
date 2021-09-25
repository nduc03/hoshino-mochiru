const { SlashCommandBuilder } = require('@discordjs/builders')
const { Permissions } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('react')
        .setDescription('React emoji to message as Hoshino Mochiru')
        .addStringOption(options =>
            options.setName('emoji')
                .setDescription('Emoji name without colon')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('link_or_id')
                .setDescription('Message link or id')
                .setRequired(false)),
    async execute(interaction) {
        const permissions = await interaction.member.permissions
        if (!permissions.has(Permissions.FLAGS.ADMINISTRATOR)) {
            await interaction.reply({
                content: 'Sorry, only administrators can use this command.',
                ephemeral: true
            })
            return
        }

        const all_emojis = interaction.guild.emojis.cache
        const react_emoji_name = interaction.options.getString('emoji')
        const id_option = parseID(interaction.options.getString('link_or_id'))

        const react_emoji = null || all_emojis.find(emoji => {
            return emoji.name == react_emoji_name
        }) // Currently it only works guild emoji

        if (!react_emoji) {
            await interaction.reply({
                content: `Can't find the emoji you are looking for :(`,
                ephemeral: true
            })
            return
        }

        if (id_option === null) {
            interaction.channel.messages.fetch({ limit: 1 }).then(messages => {
                messages.first().react(react_emoji)
            }).catch(err => { console.error(err) })

            await interaction.reply({
                content: `Reaction added.`,
                ephemeral: true
            })
        }
        else if (Number.isInteger(parseInt(id_option))) {
            // id reaction currently not working.
            interaction.channel.messages.react(id_option, react_emoji).then(async () => {
                await interaction.reply({
                    content: `Reaction added.`,
                    ephemeral: true
                })
            }).catch(async () => {
                await interaction.reply({
                    content: `Can't find the message you're looking for :(`,
                    ephemeral: true
                })
                return
            })
        }
        else {
            await interaction.reply({
                content: `Can't find the message you're looking for :(`,
                ephemeral: true
            })
            return
        }
    }
}
function parseID(messageLinkOrId) {
    if (messageLinkOrId === null) {
        return null
    }
    else if (Number.isInteger(parseInt(messageLinkOrId))) {
        return messageLinkOrId
    }
    else if (messageLinkOrId.includes('https://discord.com/channels')) {
        const link_parts = messageLinkOrId.split('/')
        return link_parts[link_parts.length - 1]
    }
    else {
        return messageLinkOrId
    }
}
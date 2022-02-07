const choice = require('../utils/choice')
// eslint-disable-next-line no-unused-vars
const { Client } = require('discord.js')

/**
 * Send welcome message to welcome channel every time a new user is join the guild
 * @param {Client} client Bot client object
 * @param {string | number} channelId The text channel where the message will be sent
 * @param {string} username Name of new member
 */
async function sendWelcome(client, channelId, username) {
    const welcome = [
        'https://cdn.discordapp.com/attachments/889538894905884734/891235295675166750/welcome.mp3',
        'https://cdn.discordapp.com/attachments/889538894905884734/891235472460881950/welcome.mp3',
        'https://cdn.discordapp.com/attachments/889538894905884734/891235581030457344/welcome.mp3',
    ]
    const channel = await client.channels.fetch(channelId)
    const hiMessage = [
        `Hi ${username}, welcome to our server. We hope you can stay with us for a long time.`,
        `Nice to see you here, ${username}. We hope you can stay with us for a long time.`
    ]
    channel.send({ content: choice(hiMessage), files: [choice(welcome)] })
}

module.exports = sendWelcome
const choice = require('./choice')

async function sendWelcome(client, channelId, user) {
    // Send welcome message to welcome channel every time a new user is join the guild
    const welcome = [
        'https://cdn.discordapp.com/attachments/889538894905884734/891235295675166750/welcome.mp3',
        'https://cdn.discordapp.com/attachments/889538894905884734/891235472460881950/welcome.mp3',
        'https://cdn.discordapp.com/attachments/889538894905884734/891235581030457344/welcome.mp3',
    ]
    const channel = await client.channels.fetch(channelId)
    const hiMessage = [
        `Hi ${user}, welcome to our server. We hope you can stay with us for a long time.`,
        `Nice to see you here, ${user}. We hope you can stay with us for a long time.`
    ]
    channel.send({ content: choice(hiMessage), files: [choice(welcome)] })
}

module.exports = sendWelcome
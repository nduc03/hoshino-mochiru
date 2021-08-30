"use strict"

const { Client, Collection, Intents } = require('discord.js')
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_PRESENCES] })
const fs = require('fs')
const { TimeEmitter } = require('./features/TimeCheck.js')

require('dotenv').config()
const checkTime = new TimeEmitter()

client.commands = new Collection();

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    // set a new item in the Collection
    // with the key as the command name and the value as the exported module
    client.commands.set(command.data.name, command);
}

function choice(array) {
    return array[Math.floor(Math.random() * array.length)]
}

async function sendWelcome(_client, channelId, user) {
    const welcome = [
        'https://storage.googleapis.com/host-chan/wellcome/wc1.mp3',
        'https://storage.googleapis.com/host-chan/wellcome/wc2.mp3',
        'https://storage.googleapis.com/host-chan/wellcome/wc3.mp3',
    ]
    const channel = await _client.channels.fetch(channelId)
    const hiMessage = [
        `Hi ${user}, have a good day.`,
        `Nice to meet you, ${user}`
    ]
    channel.send({ content: choice(hiMessage), files: [choice(welcome)] })
}

var callTimes = 0
var welcomedPeople = []
const welcomeChannel = '770224161720631307'

checkTime.setVNHours(6).setTimeCheckInterval(60000)

checkTime.on('rightTime', async () => {
    callTimes++
    if (callTimes == 1) {
        welcomedPeople = []
        // TODO: check who already online at this time.
    }
})

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`)
    checkTime.run()
})

client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return

    const command = client.commands.get(interaction.commandName)

    if (!command) return;

    try {
        await command.execute(interaction)
    } catch (error) {
        console.error(error)
    }
})

client.on('messageCreate', async message => {
    await console.log(`${message.author.tag}: ${message.content}`)
    // TODO: Make some reply with some message
    if (message.author.id !== client.user.id) {
        // Call some function here
    }
})

client.on('presenceUpdate', async (oldPresence, newPresence) => {
    const presence = await newPresence
    if (presence.guild.id == process.env.RELEASE_GUILD_ID) {
        const user = await client.users.fetch(presence.userId)
        if (!user.bot && !welcomedPeople.includes(user.id) && presence.status == 'online') {
            await sendWelcome(client, welcomeChannel, user)
            welcomedPeople.push(user.id)
        }
    }
})

client.login(process.env.TOKEN)
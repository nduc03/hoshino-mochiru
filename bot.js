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
var welcomed = false
var welcomeChannel = '779015767772758056' // Default channel

checkTime.setVNHours(6).setTimeCheckInterval(60000)

checkTime.on('rightTime', async () => {
    callTimes++
    if (callTimes == 1) {
        welcomed = false
        // TODO: check who already online at this time.
    }
})

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`)
    checkTime.run()
})

client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return

    if (interaction.commandName == 'welcome') {
        // Execute welcome command.
        const channel = interaction.options.getChannel('set_channel')
        if (channel.isText()) {
            welcomeChannel = channel.id.toString()
            await interaction.reply(`Welcome channel is now set to **${channel.name}**`)
        }
        else {
            await interaction.reply({ content: 'Text channel is required.', ephemeral: true })
        }
    }

    const command = client.commands.get(interaction.commandName)

    if (!command) return;

    try {
        if (interaction.commandName != 'welcome') {
            // Execute other commands.
            await command.execute(interaction)
        }
    } catch (error) {
        console.error(error)
    }
})

client.on('messageCreate', async message => {
    await console.log(`${message.author.tag}: ${message.content}`)
    if (message.author.id !== client.user.id) {
        // Call some function here
    }
})

client.on('presenceUpdate', async (oldPresence, newPresence) => {
    const presence = await newPresence
    if (presence.guild.id == process.env.RELEASE_GUILD_ID) {
        const user = await client.users.fetch(presence.userId)
        if (!user.bot && !welcomed && presence.status == 'online' && welcomeChannel) {
            await sendWelcome(client, welcomeChannel, user)
            welcomed = true
        }
    }
})

client.login(process.env.TOKEN)
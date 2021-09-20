const { Client, Collection, Intents, Permissions } = require('discord.js')
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_PRESENCES] })
const fs = require('fs')
const { TimeEmitter } = require('./features/TimeCheck')
const redis = require("redis")

require('dotenv').config()
const checkTime = new TimeEmitter()
const checkNight = new TimeEmitter()
const rdClient = redis.createClient(process.env.REDIS_URL || 3000)

rdClient.on('error', function (error) {
    console.error(error)
})

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
        'https://host-chan.s3.ir-thr-at1.arvanstorage.com/wc1.mp3',
        'https://host-chan.s3.ir-thr-at1.arvanstorage.com/wc2.mp3',
        'https://host-chan.s3.ir-thr-at1.arvanstorage.com/wc3.mp3',
    ]
    const channel = await _client.channels.fetch(channelId)
    const hiMessage = [
        `Hi ${user}, have a good day.`,
        `Nice to meet you, ${user}`
    ]
    channel.send({ content: choice(hiMessage), files: [choice(welcome)] })
}

function watchingDonut(client) {
    client.user.setStatus('online')
}

function setStatusSleep(client) {
    client.user.setStatus('idle')
}

var callTimes = 0
var welcomed = false
var welcomeChannel = '779015767772758056' // Default channel
var isDBStarted = false

// Check current time is 6h in VN(GMT+7), the callback run every 60000 milliseconds
checkTime.setVNHours(6).setTimeCheckInterval(60000)

checkNight.setVNHours(22).setTimeCheckInterval(60000 * 15) // callback run every 15 minutes

checkTime.on('rightTime', () => {
    callTimes++
    if (callTimes == 1) {
        welcomed = false
    }
    watchingDonut(client)
})

checkNight.on('rightTime', () => {
    setStatusSleep(client)
})

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`)

    const sleep_time = [23, 24, 25, 26, 27, 28, 29, 30] // 25 -> 30 is 1h -> 6h
    const nowUTCHours = new Date(Date.now()).getUTCHours()
    if (sleep_time.includes(nowUTCHours + 7)) {
        setStatusSleep(client)
    }
    else {
        watchingDonut(client)
        setInterval(watchingDonut, 60 * 60 * 1000, client) // 1 hour
    }

    checkTime.run() // Start checkTime callback
    rdClient.get('channel', (err, reply) => {
        if (err) { console.error(err) }

        if (reply != null) {
            welcomeChannel = reply // Retrieve channel id when bot start/restart
        }
        isDBStarted = true // Checking DB is started is necessary because of the asynchrony of the entire script
    })
})

client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return

    if (interaction.commandName == 'welcome') {
        if (!interaction.member.permissions.has(Permissions.FLAGS.ADMINISTRATOR)){
            await interaction.reply({
                content: 'Sorry, only administrators can use this command.',
                ephemeral: true
            })
            return
        }
        // Execute welcome command.
        const channel = interaction.options.getChannel('set_channel')
        if (channel.isText()) {
            // If user change welcome channel correctly
            welcomeChannel = channel.id.toString()
            rdClient.set('channel', welcomeChannel) // Save channel id to Database
            await interaction.reply(`Welcome channel is now set to **${channel.name}**`)
        }
        else {
            // If user use command to voice channel and thread channel
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
        // Execute message interaction here.
    }
})

client.on('presenceUpdate', async (oldPresence, newPresence) => {
    if (isDBStarted) { // Only allow to run if database finish to start
        const presence = await newPresence
        if (presence.guild.id == process.env.RELEASE_GUILD_ID) {
            const user = await client.users.fetch(presence.userId)
            // if explain:
            // condition "welcomeChannel": check welcomeChannel id is not undefined
            // condition "!welcomed": check if any member is welcomed in that day
            if (!user.bot && presence.status == 'online' && !welcomed && welcomeChannel) {
                // Feature explain:
                // Send welcome message for the first online member in "Sieben and Hydrocivik server" in that day
                // The day restart at 6h (GMT+7) everyday
                await sendWelcome(client, welcomeChannel, user)
                welcomed = true
            }
        }
    }
})

client.login(process.env.TOKEN)
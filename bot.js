const { Client, Collection, Intents, Permissions } = require('discord.js')
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_PRESENCES] })
const fs = require('fs')
const { UTCHoursEmitter } = require('./features/TimeCheck')
const redis = require("redis")
const parseInfo = require('./features/info')

require('dotenv').config()
const checkTime = new UTCHoursEmitter()
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
    // pick a element from the array
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

var callTimes = 0
var welcomed = false
var welcomeChannel = '779015767772758056' // Default channel
var isDBStarted = false
var checkedWelcomed = false

// Check current time every 60000 milliseconds (1 minute)
checkTime.setTimeCheckInterval(60000)

checkTime.on('23h', () => { // 23h UTC is 6h in VN(GMT+7)
    callTimes++
    if (callTimes == 1) {
        welcomed = false
        rdClient.set('welcomed', false)
    }
    client.user.setStatus('online')
})

checkTime.on('16h', () => { // 16h UTC is 23h in VN(GMT+7)
    client.user.setStatus('idle')
})

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`)

    checkTime.run() // Start checkTime callback
    rdClient.get('channel', (err, reply) => {
        if (err) { console.error(err) }

        if (reply != null) {
            welcomeChannel = reply // Retrieve channel id when bot start/restart
        }
        isDBStarted = true // Checking DB is started is necessary because of the asynchrony of the entire script
    })
    rdClient.get('welcomed', (err, reply) => {
        if (err) { console.error(err) }

        if (reply != null) {
            welcomed = reply
        }
        checkedWelcomed = true
    })
})

client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return

    if (interaction.commandName == 'welcome') {
        // Check if the user has permission: ADMINISTRATOR
        if (!interaction.member.permissions.has(Permissions.FLAGS.ADMINISTRATOR)) {
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
    
    // Find command object by command name
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
    const lastMessage = await message.content
    await console.log(`${message.author.tag}: ${message.content}`)
    if (message.author.id !== client.user.id) { // If message not from myself, execute the code
        if (lastMessage.startsWith('!info')) {
            // if command is !info, split it into list of word
            // then filter the blank words (filter when user intentionally add more space unnecessarily)
            // (filter example: "  !info   @user   " -split-> ['','','!info','','','@user','',''] -filter-> ['!info','@user'])
            // then get the second value of the array
            // then use parseInfo() to get the info list
            // then save it to mentionInfoList
            const mentionInfoList = parseInfo(lastMessage.split(' ').filter(args => args !== '')[1])

            // undefined when only have command without arguments, eg: "!info   "
            // null when command has arguments but incorrect arguments or info can't be found,
            // eg: "!info @not_exist_user", or "!info wrong_argument"
            if (mentionInfoList === undefined) {
                return
            }
            if (mentionInfoList !== null) {
                // then pick 1 random file from mention list
                message.channel.send({ files: [choice(mentionInfoList)] })
            }
            else {
                message.channel.send('Sorry, I don\'t know anything about this person 😥')
            }
        }

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
            // condition "checkedWelcomed": check if variable "welcomed" is retrieved by Database or not
            if (!user.bot && presence.status == 'online' && !welcomed && welcomeChannel && checkedWelcomed) {
                // Feature explain:
                // Send welcome message for the first online member in "Sieben and Hydrocivik server" in that day
                // The day restart at 6h (GMT+7) everyday
                await sendWelcome(client, welcomeChannel, user)
                welcomed = true
                rdClient.set('welcomed', true)
            }
        }
    }
})

client.login(process.env.TOKEN)
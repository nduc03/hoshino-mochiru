const { Client, Collection, Intents, Permissions } = require('discord.js')
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MEMBERS] })
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

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'))

var welcomeChannel = '770224161720631307' // Default welcome channel

const image = [
    'https://cdn.discordapp.com/attachments/889538894905884734/890285237999898694/edited2.png',
    'https://cdn.discordapp.com/attachments/889538894905884734/890287201110335598/edited.png'
]

for (const file of commandFiles) {
    const command = require(`./commands/${file}`)
    // set a new item in the Collection
    // with the key as the command name and the value as the exported module
    client.commands.set(command.data.name, command)
}

function choice(array) {
    // pick a element from the array
    return array[Math.floor(Math.random() * array.length)]
}

async function sendWelcome(_client, channelId, user) {
    const welcome = [
        // TODO: Need to download then rename those to welcome then upload to info pack
        'https://host-chan.s3.ir-thr-at1.arvanstorage.com/wc1.mp3',
        'https://host-chan.s3.ir-thr-at1.arvanstorage.com/wc2.mp3',
        'https://host-chan.s3.ir-thr-at1.arvanstorage.com/wc3.mp3',
    ]
    const channel = await _client.channels.fetch(channelId)
    const hiMessage = [
        `Hi ${user}, welcome to our server. We hope you can stay with us for a long time.`,
        `Nice to see you here, ${user}. We hope you can stay with us for a long time.`
    ]
    channel.send({ content: choice(hiMessage), files: [choice(welcome)] })
}


checkTime.on('23h', () => { // 23h UTC is 6h in VN(GMT+7)
    client.user.setStatus('online')
})

checkTime.on('17h', () => { // 16h UTC is 0h in VN(GMT+7)
    client.user.setStatus('idle')
})

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`)
    // Check current time every 60000 milliseconds (1 minute)
    checkTime.setTimeCheckInterval(60000).run() // Start checkTime callback
    rdClient.get('welcome', (err, reply) => {
        if (err) { console.error(err) }

        if (reply != null) {
            welcomeChannel = reply // Retrieve channel id when bot start/restart
        }
        else {
            rdClient.set('welcome', welcomeChannel)
        }
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
    if (message.author.id == 159985870458322944) { // Bot MEE6
        if (message.content.includes('885036466504368128')) {// 885036466504368128 is golden ramsay
            // Send inspiration message to @Golden Ramsay when he level up
            message.channel.send('<:woahhh:885786490637000704> you did very well, <@!885036466504368128>. Congratulations 🎉!')
            message.channel.send({ files: [choice(image)] })
        }
    }
    const lastMessage = message.content
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
                await message.channel.send({ files: [choice(mentionInfoList)] })
            }
            else {
                await message.channel.send('Sorry, I don\'t know anything about this person 😥')
            }
        }

    }
})

client.on('guildMemberAdd', member => {
    // Send a greeting to the new guild member
    sendWelcome(client, welcomeChannel, member)
})

client.login(process.env.TOKEN)
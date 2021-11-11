const { Client, Collection, Intents, Permissions } = require('discord.js')
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MEMBERS] })
const fs = require('fs')
const redis = require("redis")

const { UTCHoursEmitter } = require('./features/TimeCheck')
const getInfo = require('./features/getInfo')
const sendWelcome = require('./features/sendWelcome')
const choice = require('./features/choice')
const parseMessageCommand = require('./features/parseMessageCommand')


require('dotenv').config()
const checkTime = new UTCHoursEmitter()
const rdClient = redis.createClient(process.env.REDIS_URL || 3000)
const token = (process.env.DEBUG == 'true') ? process.env.DEV_TOKEN : process.env.PRODUCT_TOKEN

// Import all commands
client.commands = new Collection()
fs.readdirSync('./commands')
    .filter(file => file.endsWith('.js'))
    .forEach(file => {
        const command = require(`./commands/${file}`)
        // set a new item in the Collection
        // with the key as the command name and the value as the exported module
        client.commands.set(command.data.name, command)
    })

// Default welcome channel (it will be set if DB is initialized first time or DB is unavailable)
var welcomeChannel = '770224161720631307'

const image = [
    'https://cdn.discordapp.com/attachments/889538894905884734/890285237999898694/edited2.png',
    'https://cdn.discordapp.com/attachments/889538894905884734/890287201110335598/edited.png'
]

rdClient.on('error', function (error) {
    console.error(error)
})


checkTime.on('23h', () => { // 23h UTC is 6h in VN(GMT+7)
    client.user.setStatus('online')
})

checkTime.on('17h', () => { // 17h UTC is 0h in VN(GMT+7)
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
        const channel = interaction.options.getChannel('channel')
        if (channel === null) {
            console.warn('Cannot get welcome channel.')
            await interaction.reply({
                content: 'Sorry, an unexpected error occured, please try again 😥',
                ephemeral: true
            }) 
            return
        }
        if (channel.isText()) {
            // If user change welcome channel correctly
            welcomeChannel = channel.id.toString()
            rdClient.set('channel', welcomeChannel) // Save channel id to Database
            await interaction.reply(`Welcome channel is now set to **${channel.name}**`)
        }
        else {
            // If user use command to voice channel or thread channel
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
    if (message.author.id == 159985870458322944) { // 159985870458322944 is Bot MEE6
        const simpMembers = (await message.guild.roles.fetch('888429562801844225')).members
        if (simpMembers != null) {
            simpMembers.forEach(member => {
                if (message.content.includes(member.id)) {
                    // Send inspiration message to @simp role when they level up
                    message.channel.send(`<:woahhh:885786490637000704> you did very well, ${member}. Congratulations 🎉!`)
                    message.channel.send({ files: [choice(image)] })
                }
            })
        }
        else {
            console.warn('Fetch simpMembers = null')
        }
        return
    }

    // If message not from myself, execute the code
    if (message.author.id !== client.user.id) {
        const lastRecentMessage = message.content
        if (lastRecentMessage.startsWith('!info')) {
            // if command is !info, parse this command to list using parseMessageCommand
            // then get the second value of the array
            // then use parseInfo() to get the info list
            // then save it to mentionInfoList
            const mentionInfoList = getInfo(parseMessageCommand(lastRecentMessage)[1])
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

client.login(token)

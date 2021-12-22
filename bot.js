const { Client, Collection, Intents, Permissions } = require('discord.js')
const fs = require('fs')
const rd = require("redis")

const { UTCHoursEmitter } = require('./utils/TimeCheck')
const getInfo = require('./utils/getInfo')
const choice = require('./utils/choice')
const parseMessageCommand = require('./utils/parseMessageCommand')
const sendWelcome = require('./functions/sendWelcome')
const images = require('./constants/congratulation_images')
const Constants = require('./constants/constants')


require('dotenv').config()
const currentTime = new UTCHoursEmitter()
const redis = rd.createClient(process.env.REDIS_URL || 3000)
const token = (process.env.DEBUG == 'true') ? process.env.DEV_TOKEN : process.env.PRODUCT_TOKEN
const bot = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MEMBERS] })

// Import all commands
bot.commands = new Collection()
fs.readdirSync('./commands')
    .filter(file => file.endsWith('.js'))
    .forEach(file => {
        const command = require(`./commands/${file}`)
        // set a new item in the Collection
        // with the key as the command name and the value as the exported module
        bot.commands.set(command.data.name, command)
    })

// Default welcome channel (it will be set if DB is initialized first time or DB is unavailable)
let welcomeChannelID = Constants.WELCOME_CHANNEL_ID

redis.on('error', function (error) {
    console.error(error)
})


currentTime.on('23h', () => { // 23h UTC is 6h in VN(GMT+7)
    bot.user.setStatus('online')
})

currentTime.on('17h', () => { // 17h UTC is 0h in VN(GMT+7)
    bot.user.setStatus('idle')
    bot.guilds.fetch(Constants.SIEBEN_AND_HYDROCIVIK_SERVER_ID)
        .then(async guild => {
            const role = await guild.roles.fetch(Constants.ARCHIVE_ROLE_ID)
            role.members.forEach(member => {
                member.roles.remove(role)
            })
        })
        .catch(err => console.error(err))
})


bot.on('ready', () => {
    console.log(`Logged in as ${bot.user.tag}!`)
    // Check current time every 60000 milliseconds (1 minute)
    currentTime.setTimeCheckInterval(60000).run() // Start checking time
    redis.get('welcomeChannel', (err, reply) => {
        if (err) { console.error(err) }

        if (reply != null) {
            welcomeChannelID = reply // Retrieve channel id when bot start/restart
        }
        else {
            redis.set('welcomeChannel', welcomeChannelID)
        }
    })
})

bot.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return

    if (interaction.commandName === 'welcome') {
        // Check if the user has permission: ADMINISTRATOR
        if (typeof interaction.member.permissions !== 'string' && !interaction.member.permissions.has(Permissions.FLAGS.ADMINISTRATOR)) {
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
                content: 'Sorry, an unexpected error occurred, please try again 😥',
                ephemeral: true
            })
            return
        }
        if (channel.isText()) {
            // If user change welcome channel correctly
            welcomeChannelID = channel.id.toString()
            redis.set('welcomeChannel', welcomeChannelID) // Save channel id to Database
            await interaction.reply(`Welcome channel is now set to **${channel.name}**`)
        }
        else {
            // If user use command to voice channel or thread channel
            await interaction.reply({ content: 'Text channel is required.', ephemeral: true })
        }
    }

    // Find command object by command name
    const command = bot.commands.get(interaction.commandName)

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

bot.on('messageCreate', async message => {
    if (message.author.id == Constants.BOT_MEE6_ID) {
        const simpMembers = (await message.guild.roles.fetch(Constants.SIMP_ROLE_ID)).members
        if (simpMembers != null) {
            simpMembers.forEach(member => {
                if (message.content.includes(member.id)) {
                    // Send inspiration message to @simp role when they level up
                    message.channel.send(`<:woahhh:885786490637000704> you did very well, ${member}. Congratulations 🎉!`)
                    message.channel.send({ files: [choice(images)] })
                }
            })
        }
        else {
            console.warn('Fetch simpMembers = null')
        }
        return
    }

    // If message not from myself, execute the code
    if (message.author.id !== bot.user.id) {
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

bot.on('guildMemberAdd', async member => {
    // Send a greeting to the new guild member
    if (member.guild.channels.cache.has(welcomeChannelID)) {
        await sendWelcome(bot, welcomeChannelID, member)
    }
    else {
        console.log('New member added at other server.')
    }
})

bot.login(token)

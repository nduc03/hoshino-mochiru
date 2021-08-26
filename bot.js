const { Client, Collection, Intents } = require('discord.js')
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] })
const fs = require('fs')
const exec = require('child_process')

require('dotenv').config()

if (process.argv.includes('--doregistercmd')) {
    try {
        exec.execSync('node register_cmd.js')
        console.log('Executed: node register_cmd.js')
    }
    catch (err) {
        console.error(err)
    }
}

client.commands = new Collection();

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    // set a new item in the Collection
    // with the key as the command name and the value as the exported module
    client.commands.set(command.data.name, command);
}

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`)
    client.user.setPresence({ activities: [{ name: 'game' }], status: 'dnd' });
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

client.login(process.env.TOKEN)
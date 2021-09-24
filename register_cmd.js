const { REST } = require('@discordjs/rest')
const { Routes } = require('discord-api-types/v9')
const fs = require('fs')
require('dotenv').config()

var commands = []

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	commands.push(command.data.toJSON());
}

const rest = new REST({ version: '9' }).setToken(process.env.TOKEN);

(async () => {
    try {
        console.log('Started refreshing application (/) commands.')

        var commandRoutes = null
        if (process.argv[2] === 'release') {
            commandRoutes = Routes.applicationCommands(process.env.CLIENT_ID)
        }
        else if (process.argv[2] === 'fast-release'){
            commandRoutes = Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.RELEASE_GUILD_ID)
        }
        else if (process.argv[2] === 'test' || process.argv[2] === undefined) {
            commandRoutes = Routes.applicationGuildCommands(process.env.DEV_CLIENT_ID, process.env.DEV_GUILD_ID)
        }

        if (process.argv[3] === 'delete') {
            commands = []
        }

        await rest.put(
            commandRoutes,
            { body: commands },
        );

        console.log('Successfully reloaded application (/) commands.')
    } catch (error) {
        console.error(error)
    }
})()
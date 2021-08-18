const { REST } = require('@discordjs/rest')
const { Routes } = require('discord-api-types/v9')
const fs = require('fs')
require('dotenv').config()

const commands = []

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
        else {
            commandRoutes = Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.DEV_GUILD_ID)
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
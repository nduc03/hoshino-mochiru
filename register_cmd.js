const { REST } = require('@discordjs/rest')
const { Routes } = require('discord-api-types/v9')
const fs = require('fs')
const Constants = require('./constants/id_constants')
require('dotenv').config()

var commands = []

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'))

for (const file of commandFiles) {
    const command = require(`./commands/${file}`)
    commands.push(command.data.toJSON())
}

const rest = new REST({ version: '9' });

(async () => {
    try {
        console.log('Started refreshing application (/) commands.')

        var commandRoutes = null

        // Release mode: release, fast-release, test, special
        if (process.argv[2] === 'release') {
            // Release commands to bot (can use commands in all servers)
            rest.setToken(process.env.PRODUCT_TOKEN)
            commandRoutes = Routes.applicationCommands(Constants.CLIENT_ID)
        }
        else if (process.argv[2] === 'fast-release') {
            // Release commands to release server
            rest.setToken(process.env.PRODUCT_TOKEN)
            commandRoutes = Routes.applicationGuildCommands(Constants.CLIENT_ID, Constants.SIEBEN_AND_HYDROCIVIK_SERVER_ID)
        }
        else if (process.argv[2] === 'test' || process.argv[2] === undefined) {
            // Release commands to test server and test bot
            rest.setToken(process.env.DEV_TOKEN)
            commandRoutes = Routes.applicationGuildCommands(Constants.DEV_CLIENT_ID, Constants.NDUC_RAAS_SERVER_ID)
        }
        else if (process.argv[2] === 'special') {
            // Release commands to release server and test bot
            rest.setToken(process.env.DEV_TOKEN)
            commandRoutes = Routes.applicationGuildCommands(Constants.DEV_CLIENT_ID, Constants.SIEBEN_AND_HYDROCIVIK_SERVER_ID)
        }

        if (process.argv.includes('--del')) {
            // Delete all commands in selected release mode
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
# Hoshino Mochiru

This is the project for developing a private Discord bot that being used in my friend server.
The bot is currently stopped developing.

## Installation prerequisite

Node.js 16.6.0 or newer is required.  
Redis database is recommended for the bot to work properly.
Create .env file with correct configuration from template.env is required for the bot to work properly.  
All the npm package is listed in ```package.json```, just use ```npm install``` to install all the dependencies.  

### How to register commands

Command: ```node register_cmd.js [release-mode] [optional-args]```

- release-mode (must be the first argument if specified): ```test```, ```release```, ```fast-release```, ```special```.
  (```test``` will be chosen if it is not specified)
- release-mode must be specified if you want to add optional arguments, all optional arguments:
  - ```--del``` (optional): delete all commands from the selected release-mode.

- Examples: ```node register_cmd.js```, ```node register_cmd.js test --del```.

### How to use redisadmin

Command: ```node redisadmin del [key]```

- Deleted the specified key in database.
- Current key is being used in this bot: ```welcomeChannel```

### How to use TimeCheck

Location: "\<path_to_project\>/features/TimeCheck.js"  
Import:

```js
const { UTCHoursEmitter } = require('../features/TimeCheck')
```  

Event name format: ```<Current_UTC_Hours>h```  
Callback: no argument.

Example:

```js
checkTime.on('6h', () => {
    // Do something
})
```

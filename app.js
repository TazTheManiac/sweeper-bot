// set enviromental variables
require('dotenv').config();

// define the root directory of the application (this is a global variable and should not be reassigned)
global.__rootdir = __dirname


// get dependecies
const Discord = require('discord.js');
const path = require('path');

// define the discord client
const client = new Discord.Client();

// run the setup script
require(path.join(__rootdir, 'functions/appSetup.js'))(client);

// list events to listen to (allways send the client)
client.on('ready', () => client.events.get('ready')(client))
client.on('message', (message) => client.events.get('message')(client, message))

// log the client in to discord
client.login(process.env.DISCORD_TOKEN);

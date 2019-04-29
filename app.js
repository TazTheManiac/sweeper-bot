// https://discordapp.com/oauth2/authorize?client_id=492091540500643871&scope=bot&permissions=8

// Set a global variable to the base dir.
global.__rootdir = __dirname;

// Require modules
const fs = require(`fs`)
const Discord = require(`discord.js`)
const client = new Discord.Client()

// Require the token
const token = require(`${__rootdir}/token.json`).token

// Database stuff
const Sequelize = require('sequelize');
const sequelize = new Sequelize({
	dialect: 'sqlite',
	logging: false,
	storage: 'database.sqlite',
});

// Prefix model
const Prefixes = sequelize.define('prefixes', {
	guild_id: {
		type: Sequelize.STRING,
		unique: true,
		allowNull: false,
	},
	prefix: {
		type: Sequelize.STRING,
		defaultValue: "!",
		allowNull: false,
	},
})

// Auto channel model
const AutoChannels = sequelize.define('autoChannels', {
	guild_id: {
		type: Sequelize.STRING,
		unique: true,
		allowNull: false,
	},
	enabled: {
		type: Sequelize.BOOLEAN,
		defaultValue: false,
		allowNull: false,
	},
	category: {
		type: Sequelize.STRING,
	},
	channel: {
		type: Sequelize.STRING,
	},
})

// React roles model
const ReactRoles = sequelize.define('reactRoles', {
	message_id: {
		type: Sequelize.STRING,
		unique: true,
		allowNull: false,
	},
	role_id: {
		type: Sequelize.STRING,
		allowNull: false,
	},
})

// Commands constructor
client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync(`${__rootdir}/commands`).filter(file => file.endsWith('.js'))

for (const file of commandFiles) {
	const command = require(`${__rootdir}/commands/${file}`)
	client.commands.set(command.name, command)
}

// Ready event.
client.once(`ready`, async () => {
	Prefixes.sync()
	AutoChannels.sync()
	ReactRoles.sync()

	const readyEvent = require(`${__rootdir}/events/readyEvent`)
	readyEvent.execute(client, sequelize, AutoChannels, Prefixes)
})

// Ready event.
client.once(`guildCreate`, async guild => {
	const guildCreateEvent = require(`${__rootdir}/events/guildCreateEvent`)
	guildCreateEvent.execute(client, guild, Prefixes, AutoChannels)
})

// Message event
client.on("message", async message => {
	const messageEvent = require(`${__rootdir}/events/messageEvent`)
	messageEvent.execute(client, message, Prefixes, AutoChannels, ReactRoles)
})

// Voice state update event
client.on("voiceStateUpdate", async (oldState, newState) => {
	const voiceStateUpdateEvent = require(`${__rootdir}/events/voiceStateUpdateEvent`)
	voiceStateUpdateEvent.execute(client, oldState, newState, AutoChannels)
})

// Using raw event to catch reaction add/remove on all messages, not just cached ones
client.on("raw", async packet => {
	if (packet.t === "MESSAGE_REACTION_ADD") {
		const messageReactionAddEvent = require(`${__rootdir}/events/messageReactionAddEvent`)
		messageReactionAddEvent.execute(client, packet, ReactRoles)
	}

	if (packet.t === "MESSAGE_REACTION_REMOVE") {
		const messageReactionRemoveEvent = require(`${__rootdir}/events/messageReactionRemoveEvent`)
		messageReactionRemoveEvent.execute(client, packet, ReactRoles)
	}
})

client.login(token)

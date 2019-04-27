// https://discordapp.com/oauth2/authorize?client_id=492091540500643871&scope=bot&permissions=8

// Set a global variable to the base dir.
global.__rootdir = __dirname;

// Require modules
const fs = require(`fs`)
const Discord = require(`discord.js`)
const client = new Discord.Client()

// Require the token
const token = require(`${__rootdir}/token.json`).token

// Commands constructor
client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync(`${__rootdir}/commands`).filter(file => file.endsWith('.js'))

for (const file of commandFiles) {
	const command = require(`${__rootdir}/commands/${file}`)
	client.commands.set(command.name, command)
}

// Ready event.
client.on(`ready`, async () => {
	const readyEvent = require(`${__rootdir}/events/readyEvent`)
	readyEvent.execute(client)
})

// Message event
client.on("message", async message => {
	const messageEvent = require(`${__rootdir}/events/messageEvent`)
	messageEvent.execute(client, message)
})

// Voice state update event
client.on("voiceStateUpdate", async (oldState, newState) => {
	const voiceStateUpdateEvent = require(`${__rootdir}/events/voiceStateUpdateEvent`)
	voiceStateUpdateEvent.execute(client, oldState, newState)
})

// Using raw event to catch reaction add/remove on all messages, not just cached ones
client.on("raw", async packet => {
	if (packet.t === "MESSAGE_REACTION_ADD") {
		const messageReactionAddEvent = require(`${__rootdir}/events/messageReactionAddEvent`)
		messageReactionAddEvent.execute(client, packet)
	}

	if (packet.t === "MESSAGE_REACTION_REMOVE") {
		const messageReactionRemoveEvent = require(`${__rootdir}/events/messageReactionRemoveEvent`)
		messageReactionRemoveEvent.execute(client, packet)
	}
})

client.login(token)

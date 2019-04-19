// https://discordapp.com/oauth2/authorize?client_id=492091540500643871&scope=bot&permissions=8

// Set a global variable to the base dir.
global.__rootdir = __dirname;

// Require modules
const fs = require(`fs`)
const Discord = require(`discord.js`)
const client = new Discord.Client()
const token = require(`${__rootdir}/token.json`).token

// Commands constructor
client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync(`${__rootdir}/commands`).filter(file => file.endsWith('.js'))

for (const file of commandFiles) {
	const command = require(`${__rootdir}/commands/${file}`)
	client.commands.set(command.name, command)
}

// Event handlers
// ============================================================

// Ready event.
client.on(`ready`, async () => {
	const readyEvent = require(`${__rootdir}/events/readyEvent`)
	readyEvent.execute(client)
})

// Message event
client.on("message", async message => {
	const messageEvent = require(`${__rootdir}/events/messageEvent`)
	messageEvent.execute(message, client.commands)
})

// Reaction add event
// client.on("messageReactionAdd", async (reaction, user) => {
// 	const messageReactionAddEvent = require(`${__rootdir}/events/messageReactionAddEvent`)
// 	messageReactionAddEvent.execute(reaction, user)
// })

client.on('raw', async packet => {
	if (packet.t === 'MESSAGE_REACTION_ADD') {
		const guild = client.guilds.get(packet.d.guild_id)
		const member = guild.members.get(packet.d.user_id)
		const channel = guild.channels.get(packet.d.channel_id)
		const message = await channel.messages.fetch(packet.d.message_id)
		const emoji = packet.d.emoji

		const guildFile = require(`${__rootdir}/guilds/${guild.id}.json`)

		for (var i = 0; i < guildFile.reactRoles.length; i++) {
			if (guildFile.reactRoles[i].messageId === message.id && guildFile.reactRoles[i].emojiName === emoji.name) {
				const role = guild.roles.get(guildFile.reactRoles[i].roleId)
				if (!member.roles.has(role.id)) member.roles.add(role)
				else return
			}
		}
	} else if (packet.t === 'MESSAGE_REACTION_REMOVE') {
		const guild = client.guilds.get(packet.d.guild_id)
		const member = guild.members.get(packet.d.user_id)
		const channel = guild.channels.get(packet.d.channel_id)
		const message = await channel.messages.fetch(packet.d.message_id)
		const emoji = packet.d.emoji

		const guildFile = require(`${__rootdir}/guilds/${guild.id}.json`)

		for (var i = 0; i < guildFile.reactRoles.length; i++) {
			if (guildFile.reactRoles[i].messageId === message.id && guildFile.reactRoles[i].emojiName === emoji.name) {
				const role = guild.roles.get(guildFile.reactRoles[i].roleId)
				if (member.roles.has(role.id)) member.roles.remove(role)
				else return
			}
		}
	} else return

  // // We don't want this to run on unrelated packets
  // if (!['MESSAGE_REACTION_ADD', 'MESSAGE_REACTION_REMOVE'].includes(packet.t)) return;
  // // Grab the channel to check the message from
  // const channel = client.channels.get(packet.d.channel_id);
  // // There's no need to emit if the message is cached, because the event will fire anyway for that
  // if (channel.messages.has(packet.d.message_id)) return;
  // // Since we have confirmed the message is not cached, let's fetch it
  // channel.fetchMessage(packet.d.message_id).then(message => {
  //   // Emojis can have identifiers of name:id format, so we have to account for that case as well
  //   const emoji = packet.d.emoji.id ? `${packet.d.emoji.name}:${packet.d.emoji.id}` : packet.d.emoji.name;
  //   // This gives us the reaction we need to emit the event properly, in top of the message object
  //   const reaction = message.reactions.get(emoji);
  //   // Adds the currently reacting user to the reaction's users collection.
  //   if (reaction) reaction.users.set(packet.d.user_id, client.users.get(packet.d.user_id));
  //   // Check which type of event it is before emitting
  //   if (packet.t === 'MESSAGE_REACTION_ADD') {
  //     client.emit('messageReactionAdd', reaction, client.users.get(packet.d.user_id));
  //   }
  //   if (packet.t === 'MESSAGE_REACTION_REMOVE') {
  //     client.emit('messageReactionRemove', reaction, client.users.get(packet.d.user_id));
  //   }
  // });
});

client.login(token)

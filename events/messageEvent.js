const Discord = require(`discord.js`)
const Sequelize = require('sequelize')

module.exports = {
	name: "messageEvent",
	async execute(client, message, Prefixes, AutoChannels, ReactRoles) {

		// Get the prefix from the database
		const prefix = await Prefixes.findOne({ where: {guild_id: message.guild.id}}).get('prefix')

		// If the message don't start with the prefix, the author is a bot, or is sent in a DM, ignore it.
	  if (!message.content.startsWith(prefix) || message.author.bot || message.channel.type === "dm") return

		// Get the arguments, and the command
		// Regex explained here: https://stackoverflow.com/a/16261693
	  const args = message.content.slice(prefix.length).match(/(".*?"|[^"\s]+)+(?=\s*|\s*$)/g)
		const command = args.shift()

		// If any argument starts with a quote character, remove all instances of those from the argument.
		for (var i = 0; i < args.length; i++) {
			if (args[i].startsWith(`"`)) args[i] = args[i].replace(/"/g, ``)
		}

		// Commands
		// ========================================

		// Settings commands
		if (command === 'prefix') client.commands.get('prefix').execute(client, message, args, Prefixes)

		// Mod commands
		if (command === 'kick') client.commands.get('kick').execute(client, message, args)
		if (command === 'ban') client.commands.get('ban').execute(client, message, args)
		if (command === 'softban') client.commands.get('softban').execute(client, message, args)
		if (command === 'purge') client.commands.get('purge').execute(client, message, args)

		// Auto channel commands
		if (command === 'ac') client.commands.get('ac').execute(client, message, args, Prefixes, AutoChannels)
		if (command === 'lock') client.commands.get('lock').execute(client, message, args, AutoChannels)
		if (command === 'unlock') client.commands.get('unlock').execute(client, message, args, AutoChannels)
		if (command === 'rename') client.commands.get('rename').execute(client, message, args, AutoChannels)

		// React role commands
		if (command === "rr") client.commands.get('reactRole').execute(client, message, args, Prefixes, ReactRoles)

	}
};

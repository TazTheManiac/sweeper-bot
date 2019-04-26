module.exports = {
	name: "messageEvent",
	execute(client, message) {
		const guildFile = require(`${__rootdir}/guilds/${message.guild.id}.json`);

		// If the message don't start with the prefix, the author is a bot, or is sent in a DM, ignore it.
	  if (!message.content.startsWith(guildFile.prefix) || message.author.bot || message.channel.type === "dm") return

		// Get the arguments, and the command
		// Regex explained here: https://stackoverflow.com/a/16261693
	  const args = message.content.slice(guildFile.prefix.length).match(/(".*?"|[^"\s]+)+(?=\s*|\s*$)/g)
		const command = args.shift()

		// If any argument starts with a quote character, remove all instances of those from the argument.
		for (var i = 0; i < args.length; i++) {
			if (args[i].startsWith(`"`)) args[i] = args[i].replace(/"/g, ``)
		}

		// Commands
		// ========================================

		// Settings commands
		if (command === 'prefix') client.commands.get('prefix').execute(client, message, args)

		// Mod commands
		if (command === 'kick') client.commands.get('kick').execute(client, message, args)
		if (command === 'ban') client.commands.get('ban').execute(client, message, args)

		// Auto channel commands
		if (command === 'ac') client.commands.get('ac').execute(client, message, args)
		if (command === 'lock') client.commands.get('lock').execute(client, message, args)
		if (command === 'unlock') client.commands.get('unlock').execute(client, message, args)
		if (command === 'rename') client.commands.get('rename').execute(client, message, args)
	}
};

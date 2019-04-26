module.exports = {
	name: "messageEvent",
	execute(client, message) {
		const guildFile = require(`${__rootdir}/guilds/${message.guild.id}.json`);

		const prefix = guildFile.prefix

		// If the message don't start with the prefix, the author is a bot, or is sent in a DM, ignore it.
	  if (!message.content.startsWith(prefix) || message.author.bot || message.channel.type === "dm") return

		// Get the arguments, and the command
		// Regex explained here: https://stackoverflow.com/a/16261693
	  const args = message.content.slice(prefix.length).match(/(".*?"|[^"\s]+)+(?=\s*|\s*$)/g)
	  const command = args.shift()

		// Commands
		// ========================================

		// Settings commands
		if (command === 'prefix') client.commands.get('prefix').execute(client, message, args)

		// Mod commands
		if (command === 'kick') client.commands.get('kick').execute(client, message, args)
		if (command === 'ban') client.commands.get('ban').execute(client, message, args)

		// Auto channel commands
		if (command === 'ac') client.commands.get('ac').execute(client, message, args)

		// if (command === "test") commands.get('test').execute(message, args)
	}
};

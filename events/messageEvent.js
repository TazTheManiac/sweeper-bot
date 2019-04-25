module.exports = {
	name: "messageEvent",
	execute(message, commands) {
		const guildFile = require(`${__rootdir}/guilds/${message.guild.id}.json`);

		const prefix = guildFile.prefix

		// If the message don't start with the prefix, the author is a bot, or is sent in a DM, ignore it.
	  if (!message.content.startsWith(prefix) || message.author.bot || message.channel.type === "dm") return

		// Get the arguments, and the command
		// Regex explained here: https://stackoverflow.com/a/16261693
	  const args = message.content.slice(prefix.length).match(/(".*?"|[^"\s]+)+(?=\s*|\s*$)/g)
	  const command = args.shift()

		// Commands
		if (command === "prefix") commands.get('prefix').execute(message, args)
		if (command === "kick") commands.get('kick').execute(message, args)
		if (command === "ban") commands.get('ban').execute(message, args)

		// if (command === "test") commands.get('test').execute(message, args)
	}
};

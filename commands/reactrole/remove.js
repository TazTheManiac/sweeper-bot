const fs = require(`fs`)
const Discord = require(`discord.js`)
const colors = require(`${__rootdir}/colors`)

module.exports = {
	name: 'remove',
	description: 'Example layout of a command file',
	async execute(message, args) {

		// If the member is not and admin, ignore the command
		if (!message.member.permissions.has("ADMINISTRATOR")) return

		if (args.length === 0) console.log("missing options");

		// Ge require the guild file and get the path to it
		const guildFile = require(`${__rootdir}/guilds/${message.guild.id}.json`);
		const guildFilePath = `${__rootdir}/guilds/${message.guild.id}.json`

		// Construct the error message function for if an option is undefined
		function sendResponseMessage(undefinedObject) {
			const responseMessage = new Discord.MessageEmbed()
				.setColor(colors.orange)
				.setDescription(`**Error:** Could not get the ${undefinedObject} to use`)
				.setFooter(`@${message.member.displayName}`)

			return message.channel.send(responseMessage)
		}

		// Construct a json object from the arguments
		const options = JSON.parse(args.join(""))

		// Get the channel, message, and role
		// Notify the member if something went wrong
		const reactChannel = message.guild.channels.get(options.channel)
		if (reactChannel === undefined) return sendResponseMessage("channel")
		const reactMessage = await reactChannel.messages.fetch(options.message).catch(err => {return undefined})
		if (reactMessage === undefined) return sendResponseMessage("message")
		const role = message.guild.roles.get(options.role)
		if (role === undefined) return sendResponseMessage("role")

		for (var i = 0; i < guildFile.reactRoles.length; i++) {
			if (guildFile.reactRoles[i].messageId === reactMessage.id && guildFile.reactRoles[i].roleId === role.id) {
				guildFile.reactRoles.splice(i)
				fs.writeFileSync(guildFilePath, JSON.stringify(guildFile, null, 2))

				const responseMessage = new Discord.MessageEmbed()
					.setColor(colors.green)
					.setDescription(`Successfully unlinked role: **${role.name}**`)
					.setFooter(`@${message.member.displayName}`)

				return message.channel.send(responseMessage)
			}
		}
	}
};

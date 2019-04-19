const fs = require(`fs`)
const Discord = require(`discord.js`)
const colors = require(`${__rootdir}/colors`)

module.exports = {
	name: 'add',
	description: 'Example layout of a command file',
	async execute(message, args) {

		// If the member is not and admin, ignore the command
		if (!message.member.permissions.has("ADMINISTRATOR")) return

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
		const options = JSON.parse(args.join(" "))

		// Get the channel, message, and role
		// Notify the member if something went wrong
		const reactChannel = message.guild.channels.get(options.channel)
		if (reactChannel === undefined) return sendResponseMessage("channel")
		const reactMessage = await reactChannel.messages.fetch(options.message).catch(err => {return undefined})
		if (reactMessage === undefined) return sendResponseMessage("message")
		const role = message.guild.roles.get(options.role)
		if (role === undefined) return sendResponseMessage("role")

		// Send a message for the user to react to.
		const reactToMessage = new Discord.MessageEmbed()
			.setColor(colors.blue)
			.setDescription(`Please react to this message with the reaction you want to link to the role.`)
			.setFooter(`@${message.member.displayName}`)

		message.channel.send(reactToMessage).then(reactToMessage => {

			// Create a filter for the correct member to react
			const filter = (reaction, user) => { return reaction && user.id === message.author.id }

			// Wait for the member to react
			reactToMessage.awaitReactions(filter, { max: 1, time: 30000, errors: ['time'] }).then(collected => {

				// Get the reaction the member used
				const reaction = collected.first()

				for (var i = 0; i < guildFile.reactRoles.length; i++) {

					// Check if the message has a role linked to that reaction, notify if it has
					if (guildFile.reactRoles[i].messageId === reactMessage.id && guildFile.reactRoles[i].emojiName === reaction._emoji.name) {
						const responseMessage = new Discord.MessageEmbed()
							.setColor(colors.orange)
							.setDescription(`That message already have a role linked to that reaction`)
							.setFooter(`@${message.member.displayName}`)

						return message.channel.send(responseMessage)
					}
				}

				// Construct the object to insert into the guild settings
				const reactRole = {
					messageId: reactMessage.id,
					roleId: role.id,
					emojiName: reaction._emoji.name
				}

				// Insert the object into the guild settings
				guildFile.reactRoles.push(reactRole)
				fs.writeFileSync(guildFilePath, JSON.stringify(guildFile, null, 2))

				// React to the message with the reaction the member used
				reactMessage.react(reaction._emoji)

				reactToMessage.delete()

				const responseMessage = new Discord.MessageEmbed()
					.setColor(colors.green)
					.setDescription(`Successfully linked role: **${role.name}**, to reaction: ${reaction._emoji}`)
					.setFooter(`@${message.member.displayName}`)

				return message.channel.send(responseMessage)
			}).catch(collected => {
				reactToMessage.delete()

				const responseMessage = new Discord.MessageEmbed()
					.setColor(colors.orange)
					.setDescription(`No reaction selected, aborting`)
					.setFooter(`@${message.member.displayName}`)

				return message.channel.send(responseMessage)
			})
		})
	}
};

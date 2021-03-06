const Discord = require(`discord.js`)
const colors = require(`${__rootdir}/colors`)

module.exports = {
	name: 'kick',
	description: 'none',
	execute(client, message, args) {

		// allow only members that can manage the server to use this command
		if (!message.member.permissions.has("KICK_MEMBERS", true)) return

		// get the options
		const options = {
			member: message.guild.members.get(args[0]),
			reason: args[1],
			maxArgs: 2,
			minArgs: 1,
			waitTime: 20000
		}

		if (options.reason === undefined) options.reason = "No reason specified"

		// Check for some basic errors
		// ========================================

		// If to many arguments is given, notify the user
		if (args.length > options.maxArgs) {
			const responseMessage = new Discord.MessageEmbed()
				.setColor(colors.orange)
				.setDescription(`To many arguments. Expected a maximum of **${options.maxArgs}**, got **${args.length}**`)
			return message.channel.send(responseMessage).catch(err => {/*do nothing*/})
		}

		// If to few arguments is given, notify the user
		if (args.length < options.minArgs) {
			const responseMessage = new Discord.MessageEmbed()
				.setColor(colors.orange)
				.setDescription(`To few arguments. Expected a minimum of **${options.minArgs}**, got **${args.length}**`)
			return message.channel.send(responseMessage).catch(err => {/*do nothing*/})
		}

		// If no member could not be found, notify the user
		if (options.member === undefined) {
			const responseMessage = new Discord.MessageEmbed()
				.setColor(colors.orange)
				.setDescription(`Could not get the member, is the id correct?`)
			return message.channel.send(responseMessage).catch(err => {/*do nothing*/})
		}

		// If the reason argument is longet than 512 characters, notify the user
		if (options.reason.length > 512) {
			const responseMessage = new Discord.MessageEmbed()
				.setColor(colors.orange)
				.setDescription(`Invalid option \`reason\`, the reason specified can't be longer than 512 characters`)
			return message.channel.send(responseMessage).catch(err => {/*do nothing*/})
		}

		// If the member is not bannable, notify the user
		if (!options.member.kickable) {
			const responseMessage = new Discord.MessageEmbed()
				.setColor(colors.orange)
				.setDescription(`I do not have permission to kick the specified member`)
			return message.channel.send(responseMessage).catch(err => {/*do nothing*/})
		}

		// If all check are passed
		// ========================================

		// Send the verification message
		const responseMessage = new Discord.MessageEmbed()
			.setColor(colors.blue)
			.addField(`Kick ${options.member.displayName} with the following options?`, `**Reason:** ${options.reason}\n`)
		message.channel.send(responseMessage).then(async verificationMessage => {

			// Add reactions to the verification message
			verificationMessage.react("✅")
			verificationMessage.react("❌")

			// Create a filter that allows only the command user to react
			const filter = (reaction, user) => { return ["✅", "❌"].includes(reaction.emoji.name) && user.id === message.author.id }

			await verificationMessage.awaitReactions(filter, {max: 1, time: options.waitTime, errors: ["time"]}).then(collected => {
				const reaction = collected.first()

				// If the user reacted with an ❌, don't kick the member
				if (reaction.emoji.name === "❌") {
					verificationMessage.delete()
					const responseMessage = new Discord.MessageEmbed()
						.setColor(colors.blue)
						.setDescription(`Aborted, did not ban any member`)
					return message.channel.send(responseMessage).catch(err => {/*do nothing*/})
				}

				// If the user reacted with an ✅, kick the member
				else if (reaction.emoji.name === "✅") {
					verificationMessage.delete()
					options.member.kick(options.reason).then(kickedMember => {

						// If it was successfull, show the success message
						const responseMessage = new Discord.MessageEmbed()
							.setColor(colors.green)
							.addField(`Kicked ${options.member.displayName} with the reason`, options.reason)
						return message.channel.send(responseMessage).catch(err => {/*do nothing*/})
					}).catch(err => {

						// If there was an error, notify the user
						const responseMessage = new Discord.MessageEmbed()
							.setColor(colors.red)
							.setDescription(`There was an error kicking the member`)
						return message.channel.send(responseMessage).catch(err => {/*do nothing*/})
					})
				}
			}).catch(err => {

				// If no reaction was made, abort and notify
				verificationMessage.delete()
				const responseMessage = new Discord.MessageEmbed()
					.setColor(colors.orange)
					.setDescription(`No selection was made within ${options.waitTime / 1000} seconds, aborting`)
				return message.channel.send(responseMessage).catch(err => {/*do nothing*/})
			})
		}).catch(err => {/*do nothing*/})
	}
};

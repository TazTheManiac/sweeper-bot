const Discord = require(`discord.js`)
const Sequelize = require('sequelize')
const colors = require(`${__rootdir}/colors`)

module.exports = {
	name: 'warn',
	description: 'none',
	execute(client, message, args, Warnings) {

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
		if (options.reason.length > 255) {
			const responseMessage = new Discord.MessageEmbed()
				.setColor(colors.orange)
				.setDescription(`Invalid option \`reason\`, the reason specified can't be longer than 255 characters`)
			return message.channel.send(responseMessage).catch(err => {/*do nothing*/})
		}

		// If the member is not warnable (using kickable as an alternative), notify the user
		if (!options.member.kickable) {
			const responseMessage = new Discord.MessageEmbed()
				.setColor(colors.orange)
				.setDescription(`I do not have permission to warn the specified member`)
			return message.channel.send(responseMessage).catch(err => {/*do nothing*/})
		}

		// If all check are passed
		// ========================================

		// Send the verification message
		const responseMessage = new Discord.MessageEmbed()
			.setColor(colors.blue)
			.addField(`Warn ${options.member.displayName} with the following options?`, `**Reason:** ${options.reason}\n`)
		message.channel.send(responseMessage).then(async verificationMessage => {

			// Add reactions to the verification message
			verificationMessage.react("✅")
			verificationMessage.react("❌")

			// Create a filter that allows only the command user to react
			const filter = (reaction, user) => { return ["✅", "❌"].includes(reaction.emoji.name) && user.id === message.author.id }

			await verificationMessage.awaitReactions(filter, {max: 1, time: options.waitTime, errors: ["time"]}).then(collected => {
				const reaction = collected.first()

				// If the user reacted with an ❌, don't warn the member
				if (reaction.emoji.name === "❌") {
					verificationMessage.delete()
					const responseMessage = new Discord.MessageEmbed()
						.setColor(colors.blue)
						.setDescription(`Aborted, did not warn any member`)
					return message.channel.send(responseMessage).catch(err => {/*do nothing*/})
				}

				// If the user reacted with an ✅, warn the member
				else if (reaction.emoji.name === "✅") {
					verificationMessage.delete()

					Warnings.create({
						guild_id: message.guild.id,
						user_id: options.member.id,
						reason: options.reason
					}).then(response => {
						Warnings.findAll({where: {guild_id:  message.guild.id, user_id: options.member.id}}).then(response => {

							// Send the warning to the member
							const warnMessage = new Discord.MessageEmbed()
								.setColor(colors.orange)
								.addField(`⚠️ You have recied a warning from the server: ${message.guild.name}`, `**Reason:** ${options.reason}`)
								.setFooter(`Nr of warnings: ${response.length}`)
							options.member.send(warnMessage).catch(/*do nothing*/)

							// Send success message
							const responseMessage = new Discord.MessageEmbed()
								.setColor(colors.green)
								.setDescription(`The member has been warned`)
								.setFooter(`Nr of warnings: ${response.length}`)
							return message.channel.send(responseMessage).catch(err => {/*do nothing*/})
						})
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

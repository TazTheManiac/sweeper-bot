const fs = require(`fs`)
const Discord = require(`discord.js`)
const colors = require(`${__rootdir}/colors`)

module.exports = {
	name: 'prefix',
	description: 'none',
	execute(message, args) {

		// allow only members that can manage the server to use this command
		if (!message.member.permissions.has("MANAGE_GUILD", true)) return

		// get the options
		const options = {
			prefix: args[0],
			nrOfArgs: 1,
			waitTime: 20000
		}

		// get the guilds settings file, and the path to it
		const guildFile = require(`${__rootdir}/guilds/${message.guild.id}.json`);
		const guildFilePath = `${__rootdir}/guilds/${message.guild.id}.json`

		// Check for some basic errors
		// ========================================

		// If to many arguments is given, notify the user
		if (args.length > options.nrOfArgs) {
			const responseMessage = new Discord.MessageEmbed()
				.setColor(colors.orange)
				.setDescription(`To many arguments. Expected a maximum of **${options.nrOfArgs}**, got **${args.length}**`)
			return message.channel.send(responseMessage).catch(err => {/*do nothing*/})
		}

		// If to few arguments is given, notify the user
		if (args.length < options.nrOfArgs) {
			const responseMessage = new Discord.MessageEmbed()
				.setColor(colors.orange)
				.setDescription(`To few arguments. Expected a minimum of **${options.nrOfArgs}**, got **${args.length}**`)
			return message.channel.send(responseMessage).catch(err => {/*do nothing*/})
		}

		// if the new prefix is the same as the old, abort and notify
		if (options.prefix === guildFile.prefix) {
			const responseMessage = new Discord.MessageEmbed()
				.setColor(colors.orange)
				.setDescription(`The new prefix matches the old one, no changes made`)
			return message.channel.send(responseMessage).catch(err => {/*do nothing*/})
		}

		// If all check are passed
		// ========================================

		// Send the verification message
		const responseMessage = new Discord.MessageEmbed()
			.setColor(colors.blue)
			.setDescription(`Change the server prefix to: **${options.prefix}**`)
		message.channel.send(responseMessage).then(async verificationMessage => {

			// Add reactions to the verification message
			verificationMessage.react("✅")
			verificationMessage.react("❌")

			// Create a filter that allows only the command user to react
			const filter = (reaction, user) => { return ["✅", "❌"].includes(reaction.emoji.name) && user.id === message.author.id }

			// Send the verification message
 			await verificationMessage.awaitReactions(filter, {max: 1, time: options.waitTime, errors: ["time"]}).then(collected => {
				const reaction = collected.first()

				// If the user reacted with an ❌, don't change the prefix
				if (reaction.emoji.name === "❌") {
					verificationMessage.delete()
					const responseMessage = new Discord.MessageEmbed()
						.setColor(colors.blue)
						.setDescription(`Aborted, did not change the server prefix`)
					return message.channel.send(responseMessage).catch(err => {/*do nothing*/})
				}

				// If the user reacted with an ✅, change the prefix
				else if (reaction.emoji.name === "✅") {
					verificationMessage.delete()

					// Update and save the prefix
					guildFile.prefix = options.prefix
					fs.writeFile(guildFilePath, JSON.stringify(guildFile, null, 2), err => {

						// If there was an error saving the prefix, notify the user
						if (err) {
							const responseMessage = new Discord.MessageEmbed()
								.setColor(colors.red)
								.setDescription(`There was an error changing the server prefix`)
							return message.channel.send(responseMessage).catch(err => {/*do nothing*/})
						}

						// Else show the success message
						else {
							const responseMessage = new Discord.MessageEmbed()
								.setColor(colors.green)
								.setDescription(`Changed the server prefix to: **${options.prefix}**`)
							return message.channel.send(responseMessage).catch(err => {/*do nothing*/})
						}
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

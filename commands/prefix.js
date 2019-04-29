const Discord = require(`discord.js`)
const Sequelize = require('sequelize')
const colors = require(`${__rootdir}/colors`)

module.exports = {
	name: 'prefix',
	description: 'none',
	async execute(client, message, args, Prefixes) {

		// allow only members that can manage the server to use this command
		if (!message.member.permissions.has("MANAGE_GUILD", true)) return

		// Get the prefix from the database
		const prefix = await Prefixes.findOne({ where: {guild_id: message.guild.id}}).get('prefix')

		// get the options
		const options = {
			prefix: args[0],
			maxArgs: 1,
			minArgs: 1,
			waitTime: 20000
		}

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

		// if the new prefix is the same as the old, abort and notify
		if (options.prefix === prefix) {
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
 			await verificationMessage.awaitReactions(filter, {max: 1, time: options.waitTime, errors: ["time"]}).then(async collected => {
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

					// Try to update the prefix and notify of succes, or failure
					await Prefixes.update({prefix: options.prefix}, {where: {guild_id: message.guild.id} }).then(response => {
						if (response > 0) {
							const responseMessage = new Discord.MessageEmbed()
								.setColor(colors.green)
								.setDescription(`Changed the server prefix to: **${options.prefix}**`)
							return message.channel.send(responseMessage).catch(err => {/*do nothing*/})
						} else {
							const responseMessage = new Discord.MessageEmbed()
								.setColor(colors.red)
								.setDescription(`There was an error changing the server prefix`)
							return message.channel.send(responseMessage).catch(err => {/*do nothing*/})
						}
					}).catch(err => {
						console.error(err)
						const responseMessage = new Discord.MessageEmbed()
							.setColor(colors.red)
							.setDescription(`There was an error changing the server prefix`)
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

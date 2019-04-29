const Discord = require(`discord.js`)
const Sequelize = require('sequelize')
const colors = require(`${__rootdir}/colors`)

module.exports = {
	name: 'category',
	description: 'none',
	async execute(client, message, args, AutoChannels) {

		// allow only members that can manage the server to use this command
		if (!message.member.permissions.has("MANAGE_GUILD", true)) return

		// get the options
		const options = {
			categoryId: message.channel.parentID,
			maxArgs: 0,
			minArgs: 0,
			waitTime: 20000
		}

		const currentCategory = await AutoChannels.findOne({ where: {guild_id: message.guild.id}}).get('category')

		// Check for some basic errors
		// ========================================

		// If to many arguments is given, notify the user
		if (args.length > options.maxArgs) {
			const responseMessage = new Discord.MessageEmbed()
				.setColor(colors.orange)
				.setDescription(`To many arguments. Expected a maximum of **${options.maxArgs}**, got **${args.length}**`)
			return message.channel.send(responseMessage).catch(err => {/*do nothing*/})
		}

		// If to few arguments is given (although this might be hard with this command), notify the user
		if (args.length < options.minArgs) {
			const responseMessage = new Discord.MessageEmbed()
				.setColor(colors.orange)
				.setDescription(`To few arguments. Expected a minimum of **${options.minArgs}**, got **${args.length}**`)
			return message.channel.send(responseMessage).catch(err => {/*do nothing*/})
		}

		// If the channel the command was used in is not in a category, abort and notify
		if (options.categoryId === undefined) {
			const responseMessage = new Discord.MessageEmbed()
				.setColor(colors.orange)
				.setDescription(`This channel is not in a category`)
			return message.channel.send(responseMessage).catch(err => {/*do nothing*/})
		}

		// If the category is already used for auto channels, abort and notify
		if (currentCategory === options.categoryId) {
			const responseMessage = new Discord.MessageEmbed()
				.setColor(colors.orange)
				.setDescription(`This category is already used for auto channels on this server`)
			return message.channel.send(responseMessage).catch(err => {/*do nothing*/})
		}

		// If all check are passed
		// ========================================

		// Send the verification message
		const responseMessage = new Discord.MessageEmbed()
			.setColor(colors.blue)
			.setDescription(`Use **${message.guild.channels.get(options.categoryId).name}** as the category for auto channels`)
		message.channel.send(responseMessage).then(async verificationMessage => {

			// Add reactions to the verification message
			verificationMessage.react("✅")
			verificationMessage.react("❌")

			// Create a filter that allows only the command user to react
			const filter = (reaction, user) => { return ["✅", "❌"].includes(reaction.emoji.name) && user.id === message.author.id }

			// Send the verification message
 			await verificationMessage.awaitReactions(filter, {max: 1, time: options.waitTime, errors: ["time"]}).then(async collected => {
				const reaction = collected.first()

				// If the user reacted with an ❌, don't set the category
				if (reaction.emoji.name === "❌") {
					verificationMessage.delete()
					const responseMessage = new Discord.MessageEmbed()
						.setColor(colors.blue)
						.setDescription(`Aborted, no changes to the category for auto channels was made`)
					return message.channel.send(responseMessage).catch(err => {/*do nothing*/})
				}

				// If the user reacted with an ✅, set the category
				else if (reaction.emoji.name === "✅") {
					verificationMessage.delete()

					// Save the category
					await AutoChannels.update({category: options.categoryId}, {where: {guild_id: message.guild.id} }).then(response => {
						if (response > 0) {
							const responseMessage = new Discord.MessageEmbed()
								.setColor(colors.green)
								.setDescription(`Successfully set the category for auto channels on the server`)
							return message.channel.send(responseMessage).catch(err => {/*do nothing*/})
						} else {
							const responseMessage = new Discord.MessageEmbed()
								.setColor(colors.red)
								.setDescription(`There was an error setting the category`)
							return message.channel.send(responseMessage).catch(err => {/*do nothing*/})
						}
					}).catch(err => {
						const responseMessage = new Discord.MessageEmbed()
							.setColor(colors.red)
							.setDescription(`There was an error setting the category`)
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

// guildFile.autoChannels.categoryId = options.categoryId
// fs.writeFile(guildFilePath, JSON.stringify(guildFile, null, 2), err => {
//
// 	// If there was an error setting the category, notify the user
// 	if (err) {
// 		const responseMessage = new Discord.MessageEmbed()
// 			.setColor(colors.red)
// 			.setDescription(`There was an error setting the category`)
// 		return message.channel.send(responseMessage).catch(err => {/*do nothing*/})
// 	}
//
// 	// Else show the success message
// 	else {
// 		const responseMessage = new Discord.MessageEmbed()
// 			.setColor(colors.green)
// 			.setDescription(`Successfully set the category for auto channels on the server`)
// 		return message.channel.send(responseMessage).catch(err => {/*do nothing*/})
// 	}
// })

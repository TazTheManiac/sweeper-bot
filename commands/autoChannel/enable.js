const fs = require(`fs`)
const Discord = require(`discord.js`)
const colors = require(`${__rootdir}/colors`)

module.exports = {
	name: 'enable',
	description: 'none',
	async execute(client, message, args, AutoChannels) {

		// allow only members that can manage the server to use this command
		if (!message.member.permissions.has("MANAGE_GUILD", true)) return

		// get the options
		const options = {
			maxArgs: 0,
			minArgs: 0,
			waitTime: 20000
		}

		const currentSetting = await AutoChannels.findOne({ where: {guild_id: message.guild.id}}).get('enabled')

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

		// If auto channels is already enabled, abort and notify
		if (currentSetting === true) {
			const responseMessage = new Discord.MessageEmbed()
				.setColor(colors.orange)
				.setDescription(`Auto channels is already enabled for this server`)
			return message.channel.send(responseMessage).catch(err => {/*do nothing*/})
		}

		// If all check are passed
		// ========================================

		// Send the verification message
		const responseMessage = new Discord.MessageEmbed()
			.setColor(colors.blue)
			.setDescription(`Enable auto channels for this server`)
		message.channel.send(responseMessage).then(async verificationMessage => {

			// Add reactions to the verification message
			verificationMessage.react("✅")
			verificationMessage.react("❌")

			// Create a filter that allows only the command user to react
			const filter = (reaction, user) => { return ["✅", "❌"].includes(reaction.emoji.name) && user.id === message.author.id }

			// Send the verification message
 			await verificationMessage.awaitReactions(filter, {max: 1, time: options.waitTime, errors: ["time"]}).then(async collected => {
				const reaction = collected.first()

				// If the user reacted with an ❌, don't enable auto channels
				if (reaction.emoji.name === "❌") {
					verificationMessage.delete()
					const responseMessage = new Discord.MessageEmbed()
						.setColor(colors.blue)
						.setDescription(`Aborted, did not enable auto channels`)
					return message.channel.send(responseMessage).catch(err => {/*do nothing*/})
				}

				// If the user reacted with an ✅, enable auto channels
				else if (reaction.emoji.name === "✅") {
					verificationMessage.delete()

					// Update auto channels settings
					await AutoChannels.update({enabled: true}, {where: {guild_id: message.guild.id} }).then(response => {
						if (response > 0) {
							const responseMessage = new Discord.MessageEmbed()
								.setColor(colors.green)
								.setDescription(`Successfully enabled auto channels for the server`)
							return message.channel.send(responseMessage).catch(err => {/*do nothing*/})
						} else {
							const responseMessage = new Discord.MessageEmbed()
								.setColor(colors.red)
								.setDescription(`There was an error enabling auto channels`)
							return message.channel.send(responseMessage).catch(err => {/*do nothing*/})
						}
					}).catch(err => {
						const responseMessage = new Discord.MessageEmbed()
							.setColor(colors.red)
							.setDescription(`There was an error enabling auto channels`)
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

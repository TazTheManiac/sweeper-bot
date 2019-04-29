const fs = require(`fs`)
const Discord = require(`discord.js`)
const colors = require(`${__rootdir}/colors`)

module.exports = {
	name: 'purge',
	description: 'none',
	execute(client, message, args) {

		// allow only members that can manage the server to use this command
		if (!message.member.permissions.has("MANAGE_GUILD", true)) return

		// get the options
		const options = {
			amount: args[0],
			maxLimit: 20,
			maxArgs: 1,
			minArgs: 1
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
		if (isNaN(options.amount) || options.amount < 1 || options.amount > options.maxLimit) {
			const responseMessage = new Discord.MessageEmbed()
				.setColor(colors.orange)
				.setDescription(`Invalid amount specified, expexted a number 1-20`)
			return message.channel.send(responseMessage).catch(err => {/*do nothing*/})
		}

		// If all check are passed
		// ========================================

		// Delete the command message
		message.delete()

		// Then delete the specified amount of messages
		message.channel.bulkDelete(options.amount).then(messages => {
			const responseMessage = new Discord.MessageEmbed()
				.setColor(colors.green)
				.setDescription(`Purged **${messages.size}** messages from channel **${message.channel.name}**`)
			return message.channel.send(responseMessage).then(successMessage => {
				successMessage.delete({timeout: 3000})
			}).catch(err => {/*do nothing*/})
		}).catch(err => {
			const responseMessage = new Discord.MessageEmbed()
				.setColor(colors.red)
				.setDescription(`There was an error trying to purge messages`)
			return message.channel.send(responseMessage)
		})
	}
};

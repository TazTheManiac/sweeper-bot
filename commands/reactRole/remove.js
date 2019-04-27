const fs = require(`fs`)
const Discord = require(`discord.js`)
const colors = require(`${__rootdir}/colors`)

module.exports = {
	name: 'remove',
	description: 'none',
	async execute(client, message, args) {

		// allow only members that can manage the server to use this command
		if (!message.member.permissions.has("MANAGE_GUILD", true)) return

		// get the options
		const options = {
			message: await message.channel.messages.fetch(args[0]).catch(err => { return undefined }),
			maxArgs: 1,
			minArgs: 1,
			waitTime: 20000
		}

		// get the guilds settings file, and the path to it
		const guildFile = require(`${__rootdir}/guilds/${message.guild.id}.json`);
		const guildFilePath = `${__rootdir}/guilds/${message.guild.id}.json`

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

		// If the message is undefined, notify the user
		if (options.message === undefined) {
			const responseMessage = new Discord.MessageEmbed()
				.setColor(colors.orange)
				.setDescription(`Could not get the message, is the message id correct?`)
			return message.channel.send(responseMessage).catch(err => {/*do nothing*/})
		}

		// Check if the message has a role assosiated with it
		const indexNr = guildFile.reactRoles.findIndex(function(reactRole) { return reactRole.messageId === options.message.id})
		if (indexNr === -1) {
			const responseMessage = new Discord.MessageEmbed()
				.setColor(colors.orange)
				.setDescription(`That message dont't have a role assosiated with it`)
			return message.channel.send(responseMessage).catch(err => {/*do nothing*/})
		}

		// If all check are passed
		// ========================================

		// Remove the role from the guild settings
		guildFile.reactRoles.splice(indexNr, 1)
		fs.writeFile(guildFilePath, JSON.stringify(guildFile, null, 2), err => {
			if (err) {
				const responseMessage = new Discord.MessageEmbed()
					.setColor(colors.red)
					.setDescription(`There was an error removing the role`)
				return message.channel.send(responseMessage).catch(err => {/*do nothing*/})
			} else {
				options.message.reactions.each(async reaction => {
					if (reaction.emoji.name === "✅") {
						const reactUsers = await reaction.users.fetch()
						reactUsers.each(user => { reaction.users.remove(user) })
					}
				})
			}
		})
	}
};

const fs = require(`fs`)
const Discord = require(`discord.js`)
const colors = require(`${__rootdir}/colors`)

module.exports = {
	name: 'add',
	description: 'none',
	async execute(client, message, args) {

		// allow only members that can manage the server to use this command
		if (!message.member.permissions.has("MANAGE_GUILD", true)) return

		// get the options
		const options = {
			message: await message.channel.messages.fetch(args[0]).catch(err => { return undefined }),
			role: message.guild.roles.get(args[1]),
			maxArgs: 2,
			minArgs: 2,
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

		// If the role is undefined, notify the user
		if (options.role === undefined) {
			const responseMessage = new Discord.MessageEmbed()
				.setColor(colors.orange)
				.setDescription(`Could not get the role, is the role id correct?`)
			return message.channel.send(responseMessage).catch(err => {/*do nothing*/})
		}

		// If the message is undefined, notify the user
		if (options.message === undefined) {
			const responseMessage = new Discord.MessageEmbed()
				.setColor(colors.orange)
				.setDescription(`Could not get the message, is the message id correct?`)
			return message.channel.send(responseMessage).catch(err => {/*do nothing*/})
		}

		// Check if the message already have a role assosiated with it
		if (guildFile.reactRoles.find(function(reactRole) { return reactRole.messageId === options.message.id })) {
			const responseMessage = new Discord.MessageEmbed()
				.setColor(colors.orange)
				.setDescription(`That message already have a role assosiated with it`)
			return message.channel.send(responseMessage).catch(err => {/*do nothing*/})
		}

		// If all check are passed
		// ========================================

		// Add the role and message ids to the guild settings file
		guildFile.reactRoles.push({messageId: options.message.id, roleId: options.role.id})
		fs.writeFile(guildFilePath, JSON.stringify(guildFile, null, 2), err => {
			if (err) {
				const responseMessage = new Discord.MessageEmbed()
					.setColor(colors.red)
					.setDescription(`There was an error adding the role to the message`)
				return message.channel.send(responseMessage).catch(err => {/*do nothing*/})
			} else {
				options.message.react("✅").catch(err => {
					const responseMessage = new Discord.MessageEmbed()
						.setColor(colors.red)
						.setDescription(`There was an error adding the reaction to the message.\nYou can add the reaction yourself or run \`!rr remove <message-id>\` and try again`)
					message.channel.send(responseMessage).catch(err => {/*do nothing*/})
				})
				const responseMessage = new Discord.MessageEmbed()
					.setColor(colors.green)
					.setDescription(`Successfully associated the role **${options.role.name}** with the message`)
				message.channel.send(responseMessage).catch(err => {/*do nothing*/})
			}
		})
	}
};

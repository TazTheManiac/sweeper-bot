// const fs = require(`fs`)
const Discord = require(`discord.js`)
const Sequelize = require('sequelize')
const colors = require(`${__rootdir}/colors`)

module.exports = {
	name: 'add',
	description: 'none',
	async execute(client, message, args, ReactRoles) {

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

		// If all check are passed
		// ========================================

		await ReactRoles.findOne({ where: {message_id: options.message.id}}).then(async response => {

			// If no entry could be found
			if (response === null) {
				// Save to the database
				await ReactRoles.create({message_id: options.message.id, role_id: options.role.id}).catch(err => {
					const responseMessage = new Discord.MessageEmbed()
						.setColor(colors.red)
						.setDescription(`There was an error adding the role to the message`)
					return message.channel.send(responseMessage).catch(err => {/*do nothing*/})
				})

				// Add reaction to the message
				options.message.react("✅").catch(err => {
					const responseMessage = new Discord.MessageEmbed()
						.setColor(colors.red)
						.setDescription(`There was an error adding the reaction to the message.\nYou can add the ✅ reaction to the message yourself or run \`!rr remove <message-id>\` and try again`)
					return message.channel.send(responseMessage).catch(err => {/*do nothing*/})
				})

				// Send success message
				const responseMessage = new Discord.MessageEmbed()
					.setColor(colors.green)
					.setDescription(`Successfully associated the role **${options.role.name}** with the message`)
				return message.channel.send(responseMessage).catch(err => {/*do nothing*/})
			}

			// If an entry could be found, notify
			else {
				const responseMessage = new Discord.MessageEmbed()
					.setColor(colors.orange)
					.setDescription(`That message already have a role assosiated with it`)
				return message.channel.send(responseMessage).catch(err => {/*do nothing*/})
			}

			// if (response.dataValues.message_id === options.message.id) {
			// 	const responseMessage = new Discord.MessageEmbed()
			// 		.setColor(colors.orange)
			// 		.setDescription(`That message already have a role assosiated with it`)
			// 	return message.channel.send(responseMessage).catch(err => {/*do nothing*/})
			// } else {
			// 	await ReactRoles.create({message_id: options.message.id, role_id: options.role.id})
			// 	options.message.react("✅").catch(err => {
			// 		const responseMessage = new Discord.MessageEmbed()
			// 			.setColor(colors.red)
			// 			.setDescription(`There was an error adding the reaction to the message.\nYou can add the ✅ reaction to the message yourself or run \`!rr remove <message-id>\` and try again`)
			// 		message.channel.send(responseMessage).catch(err => {/*do nothing*/})
			// 	})
			// }
		})

		// // Add the role and message ids to the guild settings file
		// guildFile.reactRoles.push({messageId: options.message.id, roleId: options.role.id})
		// fs.writeFile(guildFilePath, JSON.stringify(guildFile, null, 2), err => {
		// 	if (err) {
		// 		const responseMessage = new Discord.MessageEmbed()
		// 			.setColor(colors.red)
		// 			.setDescription(`There was an error adding the role to the message`)
		// 		return message.channel.send(responseMessage).catch(err => {/*do nothing*/})
		// 	} else {
		// 		options.message.react("✅").catch(err => {
		// 			const responseMessage = new Discord.MessageEmbed()
		// 				.setColor(colors.red)
		// 				.setDescription(`There was an error adding the reaction to the message.\nYou can add the reaction yourself or run \`!rr remove <message-id>\` and try again`)
		// 			message.channel.send(responseMessage).catch(err => {/*do nothing*/})
		// 		})
		// 		const responseMessage = new Discord.MessageEmbed()
		// 			.setColor(colors.green)
		// 			.setDescription(`Successfully associated the role **${options.role.name}** with the message`)
		// 		message.channel.send(responseMessage).catch(err => {/*do nothing*/})
		// 	}
		// })
	}
};

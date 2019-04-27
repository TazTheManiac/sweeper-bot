const fs = require(`fs`)
const Discord = require(`discord.js`)
const colors = require(`${__rootdir}/colors`)

module.exports = {
	name: 'reactRole',
	description: 'none',
	execute(client, message, args) {

		// get the guilds settings file
		const guildFile = require(`${__rootdir}/guilds/${message.guild.id}.json`);

		// Commands constructor
		client.rrCommands = new Discord.Collection();
		const commandFiles = fs.readdirSync(`${__rootdir}/commands/reactRole`).filter(file => file.endsWith('.js'))

		for (const file of commandFiles) {
			const command = require(`${__rootdir}/commands/reactRole/${file}`)
			client.rrCommands.set(command.name, command)
		}

		const subCommand = args.shift()

		if (subCommand === undefined) {
			const responseMessage = new Discord.MessageEmbed()
				.setColor(colors.orange)
				.addField(`No arguments given`, `\`${guildFile.prefix}rr [add, remove] ...\``)
			return message.channel.send(responseMessage).catch(err => {/*do nothing*/})
		}

		if (subCommand === "add") client.rrCommands.get('add').execute(client, message, args)
		if (subCommand === "remove") client.rrCommands.get('remove').execute(client, message, args)

		// Check for some basic errors
		// ========================================

		// // If to many arguments is given, notify the user
		// if (args.length > options.maxArgs) {
		// 	const responseMessage = new Discord.MessageEmbed()
		// 		.setColor(colors.orange)
		// 		.setDescription(`To many arguments. Expected a maximum of **${options.maxArgs}**, got **${args.length}**`)
		// 	return message.channel.send(responseMessage).catch(err => {/*do nothing*/})
		// }
		//
		// // If to few arguments is given, notify the user
		// if (args.length < options.minArgs) {
		// 	const responseMessage = new Discord.MessageEmbed()
		// 		.setColor(colors.orange)
		// 		.setDescription(`To few arguments. Expected a minimum of **${options.minArgs}**, got **${args.length}**`)
		// 	return message.channel.send(responseMessage).catch(err => {/*do nothing*/})
		// }
		//
		// // if the new prefix is the same as the old, abort and notify
		// if (options.prefix === guildFile.prefix) {
		// 	const responseMessage = new Discord.MessageEmbed()
		// 		.setColor(colors.orange)
		// 		.setDescription(`The new prefix matches the old one, no changes made`)
		// 	return message.channel.send(responseMessage).catch(err => {/*do nothing*/})
		// }
		//
		// // If all check are passed
		// // ========================================
		//
		// // Send the verification message
		// const responseMessage = new Discord.MessageEmbed()
		// 	.setColor(colors.blue)
		// 	.setDescription(`Change the server prefix to: **${options.prefix}**`)
		// message.channel.send(responseMessage).then(async verificationMessage => {
		//
		// 	// Add reactions to the verification message
		// 	verificationMessage.react("✅")
		// 	verificationMessage.react("❌")
		//
		// 	// Create a filter that allows only the command user to react
		// 	const filter = (reaction, user) => { return ["✅", "❌"].includes(reaction.emoji.name) && user.id === message.author.id }
		//
		// 	// Send the verification message
 	// 		await verificationMessage.awaitReactions(filter, {max: 1, time: options.waitTime, errors: ["time"]}).then(collected => {
		// 		const reaction = collected.first()
		//
		// 		// If the user reacted with an ❌, don't change the prefix
		// 		if (reaction.emoji.name === "❌") {
		// 			verificationMessage.delete()
		// 			const responseMessage = new Discord.MessageEmbed()
		// 				.setColor(colors.blue)
		// 				.setDescription(`Aborted, did not change the server prefix`)
		// 			return message.channel.send(responseMessage).catch(err => {/*do nothing*/})
		// 		}
		//
		// 		// If the user reacted with an ✅, change the prefix
		// 		else if (reaction.emoji.name === "✅") {
		// 			verificationMessage.delete()
		//
		// 			// Update and save the prefix
		// 			guildFile.prefix = options.prefix
		// 			fs.writeFile(guildFilePath, JSON.stringify(guildFile, null, 2), err => {
		//
		// 				// If there was an error saving the prefix, notify the user
		// 				if (err) {
		// 					const responseMessage = new Discord.MessageEmbed()
		// 						.setColor(colors.red)
		// 						.setDescription(`There was an error changing the server prefix`)
		// 					return message.channel.send(responseMessage).catch(err => {/*do nothing*/})
		// 				}
		//
		// 				// Else show the success message
		// 				else {
		// 					const responseMessage = new Discord.MessageEmbed()
		// 						.setColor(colors.green)
		// 						.setDescription(`Changed the server prefix to: **${options.prefix}**`)
		// 					return message.channel.send(responseMessage).catch(err => {/*do nothing*/})
		// 				}
		// 			})
		// 		}
		// 	}).catch(err => {
		//
		// 		// If no reaction was made, abort and notify
		// 		verificationMessage.delete()
		// 		const responseMessage = new Discord.MessageEmbed()
		// 			.setColor(colors.orange)
		// 			.setDescription(`No selection was made within ${options.waitTime / 1000} seconds, aborting`)
		// 		return message.channel.send(responseMessage).catch(err => {/*do nothing*/})
		// 	})
		// }).catch(err => {/*do nothing*/})
	}
};

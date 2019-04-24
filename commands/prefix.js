const fs = require(`fs`)
const Discord = require(`discord.js`)
const colors = require(`${__rootdir}/colors`)

module.exports = {
	name: 'prefix',
	description: 'none',
	execute(message, args) {

		// allow only members that can manage the server to use this command
		if (!message.member.permissions.has("MANAGE_GUILD")) return

		// get the options
		const options = {
			prefix: args.shift()
		}

		// get the guilds settings file, and the path to it
		const guildFile = require(`${__rootdir}/guilds/${message.guild.id}.json`);
		const guildFilePath = `${__rootdir}/guilds/${message.guild.id}.json`

		// if there was no or to many arguments with the command, abort and notify
		if (args.length > 0 || options.prefix === undefined) {
			const responseMessage = new Discord.MessageEmbed()
				.setColor(colors.orange)
				.setDescription(`Missing or invalid arguments: \`${guildFile.prefix}prefix <new_prefix>\``)
				.setFooter(`@${message.member.displayName}`)
			return message.channel.send(responseMessage).catch(err => {/*do nothing*/})
		}

		// if the new prefix is the same as the old, abort and notify
		if (options.prefix === guildFile.prefix) {
			const responseMessage = new Discord.MessageEmbed()
				.setColor(colors.blue)
				.setDescription(`The new prefix matches the old one, no changes made`)
				.setFooter(`@${message.member.displayName}`)
			return message.channel.send(responseMessage).catch(err => {/*do nothing*/})
		}

		const responseMessage = new Discord.MessageEmbed()
			.setColor(colors.blue)
			.setDescription(`Update the server prefix to: **${options.prefix}**`)
			.setFooter(`@${message.member.displayName}`)
		message.channel.send(responseMessage).then(reactMessage => {

			reactMessage.react("✅")
			reactMessage.react("❌")

			const filter = (reaction, user) => { return user.id === message.author.id && ["✅", "❌"].includes(reaction.emoji.name) }
			const waitTime = 20000

			reactMessage.awaitReactions(filter, {max: 1, time: waitTime, errors: ["time"]}).then(collected => {
				const reaction = collected.first()

				if (reaction.emoji.name === "✅") {
					reactMessage.delete()

					// write the changes to the guilds settings file
					guildFile.prefix = options.prefix
					fs.writeFileSync(guildFilePath, JSON.stringify(guildFile, null, 2))

					// notify the user that the prefix was changed
					const responseMessage = new Discord.MessageEmbed()
						.setColor(colors.green)
						.setDescription(`The new prefix for this server is now: **${options.prefix}**`)
						.setFooter(`@${message.member.displayName}`)
					return message.channel.send(responseMessage).catch(err => {/*do nothing*/})

				} else if (reaction.emoji.name === "❌") {
					reactMessage.delete()
					const responseMessage = new Discord.MessageEmbed()
						.setColor(colors.blue)
						.setDescription(`Action was aborted, no changes was made`)
						.setFooter(`@${message.member.displayName}`)
					return message.channel.send(responseMessage).catch(err => {/*do nothing*/})
				}
			}).catch(err => {
				reactMessage.delete()
				const responseMessage = new Discord.MessageEmbed()
					.setColor(colors.orange)
					.setDescription(`No selection was made within ${waitTime / 1000} seconds, aborting`)
					.setFooter(`@${message.member.displayName}`)
				return message.channel.send(responseMessage).catch(err => {/*do nothing*/})
			})
		}).catch(err => {/*do nothing*/})
	}
};

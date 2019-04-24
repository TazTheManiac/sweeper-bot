const Discord = require(`discord.js`)
const colors = require(`${__rootdir}/colors`)

module.exports = {
	name: 'ban',
	description: 'none',
	execute(message, args) {

		const guildFile = require(`${__rootdir}/guilds/${message.guild.id}.json`);

		const options = {
			member: message.guild.members.get(args.shift()),
			days: args.shift(),
			reason: args.join(" ")
		}
		if (options.reason === "") options.reason = "No reason specified"

		if (options.member === undefined) {
			const responseMessage = new Discord.MessageEmbed()
				.setColor(colors.orange)
				.addField(`Invalid argument: \`id\``, `The id specified must be correct, and from a member of this server`)
				.setFooter(`@${message.member.displayName}`)
			return message.channel.send(responseMessage).catch(err => {/*do nothing*/})
		}

		if (options.reason.length > 512) {
			const responseMessage = new Discord.MessageEmbed()
				.setColor(colors.orange)
				.addField(`Invalid argument: \`reason\``, `The reason can't be longer than 512 characters`)
				.setFooter(`@${message.member.displayName}`)
			return message.channel.send(responseMessage).catch(err => {/*do nothing*/})
		}

		if (isNaN(options.days) || options.days < 0 || options.days > 7) {
			const responseMessage = new Discord.MessageEmbed()
				.setColor(colors.orange)
				.addField(`Invalid argument: \`days\``, `The amount of days must be a number (0-7)`)
				.setFooter(`@${message.member.displayName}`)
			return message.channel.send(responseMessage).catch(err => {/*do nothing*/})
		}

		if (!options.member.bannable) {
			const responseMessage = new Discord.MessageEmbed()
				.setColor(colors.red)
				.setDescription(`I do not have permission to ban the specified member`)
				.setFooter(`@${message.member.displayName}`)
			return message.channel.send(responseMessage).catch(err => {/*do nothing*/})
		}

		const responseMessage = new Discord.MessageEmbed()
			.setColor(colors.blue)
			.addField(`Ban ${options.member.displayName}, with the following options?`, `Reason: ${options.reason}\nDays: ${options.days}`)
		message.channel.send(responseMessage).then(reactMessage => {

			reactMessage.react("✅")
			reactMessage.react("❌")

			const filter = (reaction, user) => { return user.id === message.author.id && ["✅", "❌"].includes(reaction.emoji.name) }
			const waitTime = 20000

			reactMessage.awaitReactions(filter, {max: 1, time: waitTime, errors: ["time"]}).then(collected => {
				const reaction = collected.first()

				if (reaction.emoji.name === "✅") {
					reactMessage.delete()
					options.member.ban({days: options.days, reason: options.reason}).then(bannedMember => {
						const responseMessage = new Discord.MessageEmbed()
							.setColor(colors.green)
							.setDescription(`**Banned:** ${options.member.displayName}\n**Reason:** ${options.reason}`)
							.setFooter(`@${message.member.displayName}`)
						return message.channel.send(responseMessage).catch(err => {/*do nothing*/})
					}).catch(err => {
						const responseMessage = new Discord.MessageEmbed()
							.setColor(colors.red)
							.setDescription(`There was an error banning the member`)
							.setFooter(`@${message.member.displayName}`)
						return message.channel.send(responseMessage).catch(err => {/*do nothing*/})
					})
				} else if (reaction.emoji.name === "❌") {
					reactMessage.delete()
					const responseMessage = new Discord.MessageEmbed()
						.setColor(colors.blue)
						.setDescription(`Action was aborted, no member was banned`)
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

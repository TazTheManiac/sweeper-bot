const Discord = require(`discord.js`)
const colors = require(`${__rootdir}/colors`)

module.exports = {
	name: 'kick',
	description: 'Example layout of a command file',
	execute(message, args) {

		// If the member is not and admin, ignore the command
		if (!message.member.permissions.has("KICK_MEMBERS")) return

		if (args.length < 1) {
			const responseMessage = new Discord.MessageEmbed()
				.setColor(colors.blue)
				.setDescription(`Missing id and optional reason \`!kick <member_id> <reason>\``)
				.setFooter(`@${message.member.displayName}`)
			return message.channel.send(responseMessage)
		}

		const member = message.guild.members.get(args.shift())
		if (member === undefined) {
			const responseMessage = new Discord.MessageEmbed()
				.setColor(colors.orange)
				.setDescription(`Could not get the member to kick, is the id correct?`)
				.setFooter(`@${message.member.displayName}`)
			return message.channel.send(responseMessage)
		}

		let reason
		if (args.join(" ").length === 0) reason = "No reason specified"
		else reason = args.join(" ")

		if (member.kickable) {
			member.kick(reason).then(kickedMember => {
				const responseMessage = new Discord.MessageEmbed()
					.setColor(colors.green)
					.setDescription(`Kicked: ${kickedMember.displayName}\nReason: ${reason}`)
					.setFooter(`@${message.member.displayName}`)
				return message.channel.send(responseMessage)
			})
		} else {
			const responseMessage = new Discord.MessageEmbed()
				.setColor(colors.orange)
				.setDescription(`I do not have permission to kick that member.`)
				.setFooter(`@${message.member.displayName}`)
			return message.channel.send(responseMessage)
		}
	}
};

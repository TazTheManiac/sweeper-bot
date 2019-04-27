module.exports = {
	name: "messageReactionAddEvent",
	execute(client, packet) {

		// If the reaction was not a checkmark, return
		if (packet.d.emoji.name !== "✅") return

		// get the guild and the settings file
		const guild = client.guilds.get(packet.d.guild_id)
		const guildFile = require(`${__rootdir}/guilds/${guild.id}.json`)

		// Get the index number
		const indexNr = guildFile.reactRoles.findIndex(function(reactRole) { return packet.d.message_id === reactRole.messageId})

		// If the message can't be found, return
		if (indexNr === -1) return

		// Get the role and member
		const reactRole = guild.roles.get(guildFile.reactRoles[indexNr].roleId)
		const member = guild.members.get(packet.d.user_id)

		// If the member already have the role, return
		if (member.roles.find(role => { return role.id === reactRole.id }) !== undefined) return

		// Else add the role to the member
		member.roles.add(reactRole).catch(/*do nothing*/)
	}
};

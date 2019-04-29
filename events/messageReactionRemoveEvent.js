module.exports = {
	name: "messageReactionRemoveEvent",
	execute(client, packet, ReactRoles) {

		// If the reaction was not a checkmark, return
		if (packet.d.emoji.name !== "✅") return

		// Get the database entry
		ReactRoles.findOne({where: {message_id: packet.d.message_id}}).then(response => {

			// If an entry was found
			if (response) {

				// Get the guild and member from the packet, and the role from the entry
				const guild = client.guilds.get(packet.d.guild_id)
				const member = guild.members.get(packet.d.user_id)
				const role = guild.roles.get(response.dataValues.role_id)

				// If the member don't have the role, ignore
				if (member.roles.find(memberRole => {return memberRole.id === role.id}) === undefined) return

				// Remove the role from the member
				member.roles.remove(role).catch(/*do nothing*/)
			}
		})
	}
};

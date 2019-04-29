const Sequelize = require('sequelize')

module.exports = {
	name: "userJoinedChannel",
	async execute(client, newState, AutoChannels) {
		// console.log("user joined a channel");
		const newChannel = newState.channel

		autoChannels = await AutoChannels.findOne({ where: {guild_id: newState.guild.id}})

		// check that auto channels is enable on the server, and that the channel is in the correct category
		if (autoChannels.get('enabled') && newChannel.parentID === autoChannels.get('category')) {

			// If the user is the first to join the channel, clone it
			if (newChannel.members.size === 1) {
				let channelName = `${newState.member.displayName.split(/(#|\()/)[0]}'s channel`

				newChannel.clone().catch(err => {/*do nothing*/})
				newChannel.setName(channelName).catch(err => {/*do nothing*/})
			}
		}

	},
};

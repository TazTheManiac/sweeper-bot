const Sequelize = require('sequelize')

module.exports = {
	name: "userLeftChannel",
	async execute(client, oldState, AutoChannels) {
		// console.log("user joined a channel");
		const oldChannel = oldState.channel

		autoChannels = await AutoChannels.findOne({ where: {guild_id: oldState.guild.id}})

		// check that auto channels is enable on the server, and that the channel is in the correct category
		if (autoChannels.get('enabled') && oldChannel.parentID === autoChannels.get('category')) {

			// Count the voice channels in the category
			let channelCount = 0
			oldChannel.parent.children.each(channel => {
				if (channel.type === "voice") channelCount++
			})

			// If there is more than one voice channel left, and no member are left in the channel, delete it
			if (channelCount > 1 && oldChannel.members.size === 0) oldChannel.delete().catch(err => {/*do nothing*/})
			if (channelCount === 1) oldChannel.setName("Empty Channel").catch(err => {/*do nothing*/})

		}
	},
};

module.exports = {
	name: "userLeftChannel",
	execute(client, oldState) {
		// console.log("user joined a channel");
		const oldChannel = oldState.channel

		// get the guilds settings file
		const guildFile = require(`${__rootdir}/guilds/${oldState.guild.id}.json`);

		// check that auto channels is enable on the server, and that the channel is in the correct category
		if (guildFile.autoChannels.enabled && oldChannel.parentID === guildFile.autoChannels.categoryId) {

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

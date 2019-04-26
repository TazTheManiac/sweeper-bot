module.exports = {
	name: "userJoinedChannel",
	execute(client, newState) {
		// console.log("user joined a channel");
		const newChannel = newState.channel

		// get the guilds settings file
		const guildFile = require(`${__rootdir}/guilds/${newChannel.guild.id}.json`);

		// check that auto channels is enable on the server, and that the channel is in the correct category
		if (guildFile.autoChannels.enabled && newChannel.parentID === guildFile.autoChannels.categoryId) {

			// If the user is the first to join the channel, clone it
			if (newChannel.members.size === 1) {
				let channelName = `${newState.member.displayName.split(/(#|\()/)[0]}'s channel`

				newChannel.clone().catch(err => {/*do nothing*/})
				newChannel.setName(channelName).catch(err => {/*do nothing*/})
			}
		}

	},
};

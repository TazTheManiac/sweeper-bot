const userJoinedChannel = require(`${__rootdir}/functions/userJoinedChannel`)
const userLeftChannel = require(`${__rootdir}/functions/userLeftChannel`)

module.exports = {
	name: "voiceStateUpdateEvent",
	execute(client, oldState, newState) {
		// console.log(oldState.channel);
		// console.log(newState.channel);

		// check if the user joined a channel
		if (newState.channel !== null) {
			userJoinedChannel.execute(client, newState)
		}

		// check if the user left a channel
		if (oldState.channel !== null) {
			userLeftChannel.execute(client, oldState)
		}

	}
};

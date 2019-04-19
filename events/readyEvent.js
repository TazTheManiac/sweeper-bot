const setActivity = require(`${__rootdir}/functions/setActivity`)
const checkGuildsDir = require(`${__rootdir}/functions/checkGuildsDir`)
const checkGuildsFiles = require(`${__rootdir}/functions/checkGuildsFiles`)

module.exports = {
	name: "readyEvent",
	execute(client) {

		console.log("ready");

		// Set the activity of the bot
		setActivity.execute(client)

		checkGuildsDir.execute()
		checkGuildsFiles.execute(client)
	}
};

const setActivity = require(`${__rootdir}/functions/setActivity`)
const checkGuildsDir = require(`${__rootdir}/functions/checkGuildsDir`)
const checkGuildFiles = require(`${__rootdir}/functions/checkGuildFiles`)

module.exports = {
	name: "readyEvent",
	execute(client) {

		console.log("ready");

		setActivity.execute(client)
		checkGuildsDir.execute()
		checkGuildFiles.execute(client)
	}
};

const fs = require(`fs`)

module.exports = {
	name: "checkGuildsDir",
	execute(client) {

		// Check if the guilds directory is missing, and create the directory if it is.
		const dirPath = `${__rootdir}/guilds`
		if (!fs.existsSync(dirPath)) fs.mkdirSync(dirPath)

	},
};

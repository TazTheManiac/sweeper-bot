const fs = require(`fs`)

module.exports = {
	name: "checkGuildsFile",
	execute(client) {
		client.guilds.each(guild => {
			const filePath = `${__rootdir}/guilds/${guild.id}.json`
			if (!fs.existsSync(filePath)) {
				const fileContent = JSON.stringify({
					prefix: "!",
					autoChannels: {
						enabled: false,
						categoryId: null,
						channelId: null
					}
				}, null, 2)
				fs.writeFileSync(filePath, fileContent)
			}
		})
	},
};

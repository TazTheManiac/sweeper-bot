const fs = require(`fs`)

module.exports = {
	name: "checkGuildsFile",
	execute(client) {
		client.guilds.each(guild => {
			const filePath = `${__rootdir}/guilds/${guild.id}.json`
			if (!fs.existsSync(filePath)) {
				const fileContent = JSON.stringify({
					prefix: "!",
					reactRoles: []
				}, null, 2)
				fs.writeFileSync(filePath, fileContent)
			}
		})
	},
};

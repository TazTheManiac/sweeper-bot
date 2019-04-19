module.exports = {
	name: "setActivity",
	execute(client) {

		// Get the amount of guilds the bot is in.
		let guildSize = client.guilds.size

		// Set the bots activity
		if (guildSize === 1) {
			client.user.setActivity(`${client.guilds.size} server`, {type: `WATCHING`}).catch(err => {
				console.log(err);
			})
		} else if (guildSize === 0 || guildSize > 1) {
			client.user.setActivity(`${client.guilds.size} servers`, {type: `WATCHING`}).catch(err => {
				console.log(err);
			})
		}

	},
};

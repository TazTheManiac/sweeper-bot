const Sequelize = require('sequelize');
const setActivity = require(`${__rootdir}/functions/setActivity`)

module.exports = {
	name: "readyEvent",
	async execute(client, guild, Prefixes, AutoChannels) {

		// If the guild don't have a prefix entry, create one
		const prefix = await Prefixes.findOne({where: {guild_id: guild.id}})
		if (!prefix) Prefixes.create({ guild_id: guild.id })

		// If the guild don't have a auto channels entry, create one
		const autoChannel = await AutoChannels.findOne({where: {guild_id: guild.id}})
		if (!autoChannel) AutoChannels.create({ guild_id: guild.id })
	}
};

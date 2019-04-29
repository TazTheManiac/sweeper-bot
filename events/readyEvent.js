// const Sequelize = require('sequelize');
const setActivity = require(`${__rootdir}/functions/setActivity`)

module.exports = {
	name: "readyEvent",
	async execute(client, sequelize, AutoChannels, Prefixes) {

		await sequelize.authenticate().then(() => {
	  	console.log('Connection has been established successfully')
		}).catch(err => {
    	console.error('Unable to connect to the database:', err)
			client.destroy()
		});

		setActivity.execute(client)
		console.log("Ready");

		client.guilds.each(async guild => {
			const prefix = await Prefixes.findOne({where: {guild_id: guild.id}})
			if (!prefix) Prefixes.create({ guild_id: guild.id })

			const autoChannel = await AutoChannels.findOne({where: {guild_id: guild.id}})
			if (!autoChannel) AutoChannels.create({ guild_id: guild.id })
		})
	}
};

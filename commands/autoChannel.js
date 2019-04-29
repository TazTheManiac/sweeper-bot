const fs = require(`fs`)
const Discord = require(`discord.js`)
const Sequelize = require('sequelize')
const colors = require(`${__rootdir}/colors`)

module.exports = {
	name: 'ac',
	description: 'none',
	async execute(client, message, args, Prefixes, AutoChannels) {

		// Get the prefix from the database
		const prefix = await Prefixes.findOne({ where: {guild_id: message.guild.id}}).get('prefix')

		// Commands constructor
		client.acCommands = new Discord.Collection();
		const commandFiles = fs.readdirSync(`${__rootdir}/commands/autoChannel`).filter(file => file.endsWith('.js'))

		for (const file of commandFiles) {
			const command = require(`${__rootdir}/commands/autoChannel/${file}`)
			client.acCommands.set(command.name, command)
		}

		const subCommand = args.shift()

		if (subCommand === undefined) {
			const responseMessage = new Discord.MessageEmbed()
				.setColor(colors.orange)
				.addField(`No arguments given`, `\`${prefix}ac [enable, disable, set] ...\``)
			return message.channel.send(responseMessage).catch(err => {/*do nothing*/})
		}

		if (subCommand === `enable`) client.acCommands.get('enable').execute(client, message, args, AutoChannels)
		else if (subCommand === `disable`) client.acCommands.get('disable').execute(client, message, args, AutoChannels)
		else if (subCommand === `set`) client.acCommands.get('set').execute(client, message, args, Prefixes, AutoChannels)
	}
};

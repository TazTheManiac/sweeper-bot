const fs = require(`fs`)
const Discord = require(`discord.js`)
const colors = require(`${__rootdir}/colors`)

module.exports = {
	name: 'reactRole',
	description: 'none',
	async execute(client, message, args, Prefixes, ReactRoles) {

		// Get the prefix from the database
		const prefix = await Prefixes.findOne({ where: {guild_id: message.guild.id}}).get('prefix')

		// Commands constructor
		client.rrCommands = new Discord.Collection();
		const commandFiles = fs.readdirSync(`${__rootdir}/commands/reactRole`).filter(file => file.endsWith('.js'))

		for (const file of commandFiles) {
			const command = require(`${__rootdir}/commands/reactRole/${file}`)
			client.rrCommands.set(command.name, command)
		}

		const subCommand = args.shift()

		if (subCommand === undefined) {
			const responseMessage = new Discord.MessageEmbed()
				.setColor(colors.orange)
				.addField(`No arguments given`, `\`${guildFile.prefix}rr [add, remove] ...\``)
			return message.channel.send(responseMessage).catch(err => {/*do nothing*/})
		}

		if (subCommand === "add") client.rrCommands.get('add').execute(client, message, args, ReactRoles)
		if (subCommand === "remove") client.rrCommands.get('remove').execute(client, message, args, ReactRoles)
	}
};

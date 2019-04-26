const fs = require(`fs`)
const Discord = require(`discord.js`)
const colors = require(`${__rootdir}/colors`)

module.exports = {
	name: 'ac',
	description: 'none',
	execute(client, message, args) {

		// get the guilds settings file
		const guildFile = require(`${__rootdir}/guilds/${message.guild.id}.json`);

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
				.addField(`No arguments given`, `\`${guildFile.prefix}ac [enable, disable, set] ...\``)
			return message.channel.send(responseMessage).catch(err => {/*do nothing*/})
		}

		if (subCommand === `enable`) client.acCommands.get('enable').execute(client, message, args)
		else if (subCommand === `disable`) client.acCommands.get('disable').execute(client, message, args)
		else if (subCommand === `set`) client.acCommands.get('set').execute(client, message, args)
	}
};

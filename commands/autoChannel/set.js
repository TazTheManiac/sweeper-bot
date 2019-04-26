const fs = require(`fs`)
const Discord = require(`discord.js`)
const colors = require(`${__rootdir}/colors`)

module.exports = {
	name: 'set',
	description: 'none',
	execute(client, message, args) {

		// allow only members that can manage the server to use this command
		if (!message.member.permissions.has("MANAGE_GUILD", true)) return

		// get the guilds settings file
		const guildFile = require(`${__rootdir}/guilds/${message.guild.id}.json`);

		// Commands constructor
		client.acCommands.set = new Discord.Collection();
		const commandFiles = fs.readdirSync(`${__rootdir}/commands/autoChannel/set`).filter(file => file.endsWith('.js'))

		for (const file of commandFiles) {
			const command = require(`${__rootdir}/commands/autoChannel/set/${file}`)
			client.acCommands.set.set(command.name, command)
		}

		const subCommand = args.shift()

		if (subCommand === undefined) {
			const responseMessage = new Discord.MessageEmbed()
				.setColor(colors.orange)
				.addField(`No arguments given`, `\`${guildFile.prefix}ac set [category, channel]\``)
			return message.channel.send(responseMessage).catch(err => {/*do nothing*/})
		}

		if (subCommand === `category`) client.acCommands.set.get('category').execute(client, message, args)
		else if (subCommand === `channel`) client.acCommands.set.get('channel').execute(client, message, args)
	}
};

const Discord = require(`discord.js`)
const colors = require(`${__rootdir}/colors`)

module.exports = {
	name: 'rename',
	description: 'none',
	execute(client, message, args) {

		// allow only members that can manage the server to use this command
		if (!message.member.permissions.has("MANAGE_GUILD", true)) return

		// get the options
		const options = {
			name: args[0],
			voiceChannel: message.member.voice.channel,
			maxArgs: 1,
			minArgs: 1,
			waitTime: 20000
		}

		console.log(options.name);

		// get the guilds settings file, and the path to it
		const guildFile = require(`${__rootdir}/guilds/${message.guild.id}.json`);
		const guildFilePath = `${__rootdir}/guilds/${message.guild.id}.json`

		// Check for some basic errors
		// ========================================

		// If auto channels is disabled, ignore the command
		if (guildFile.autoChannels.enabled === false) return

		// If a channel is set for managing auto channels, ignore if the command is not in that channel
		if (guildFile.autoChannels.channelId !== null && message.channel.id !== guildFile.autoChannels.channelId) return

		// If to many arguments is given, notify the user
		if (args.length > options.maxArgs) {
			const responseMessage = new Discord.MessageEmbed()
				.setColor(colors.orange)
				.setDescription(`To many arguments. Expected a maximum of **${options.maxArgs}**, got **${args.length}**`)
			return message.channel.send(responseMessage).catch(err => {/*do nothing*/})
		}

		// If to few arguments is given, notify the user
		if (args.length < options.minArgs) {
			const responseMessage = new Discord.MessageEmbed()
				.setColor(colors.orange)
				.setDescription(`To few arguments. Expected a minimum of **${options.minArgs}**, got **${args.length}**`)
			return message.channel.send(responseMessage).catch(err => {/*do nothing*/})
		}

		// If the user is not in a channel, abort and notify
		if (options.voiceChannel === null) {
			const responseMessage = new Discord.MessageEmbed()
				.setColor(colors.orange)
				.setDescription(`You are currently not in a voice channel`)
			return message.channel.send(responseMessage).catch(err => {/*do nothing*/})
		}

		// If the user is not in a manageable channel, abort and notify
		if (options.voiceChannel.parentID !== guildFile.autoChannels.categoryId) {
			const responseMessage = new Discord.MessageEmbed()
				.setColor(colors.orange)
				.setDescription(`You are currently not in a manageable voice channel`)
			return message.channel.send(responseMessage).catch(err => {/*do nothing*/})
		}

		// If no name was specified, abort and notify
		if (options.name === undefined) {
			const responseMessage = new Discord.MessageEmbed()
				.setColor(colors.orange)
				.setDescription(`Invalid limit specified, expected a number 2-99`)
			return message.channel.send(responseMessage).catch(err => {/*do nothing*/})
		}

		// If all checks are passed
		// ========================================

		// Set the channel limit, and notify
		options.voiceChannel.setName(options.name).then(voiceChannel => {
			const responseMessage = new Discord.MessageEmbed()
				.setColor(colors.green)
				.setDescription(`Name for the channel now changed to **${voiceChannel.name}**`)
			return message.channel.send(responseMessage).catch(err => {/*do nothing*/})
		}).catch(err => {
			const responseMessage = new Discord.MessageEmbed()
				.setColor(colors.red)
				.setDescription(`There was an error changing the channel name`)
			return message.channel.send(responseMessage).catch(err => {/*do nothing*/})
		})

	}
};

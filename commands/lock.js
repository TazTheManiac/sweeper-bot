const Discord = require(`discord.js`)
const Sequelize = require('sequelize')
const colors = require(`${__rootdir}/colors`)

module.exports = {
	name: 'lock',
	description: 'none',
	async execute(client, message, args, AutoChannels) {

		// allow only members that can manage the server to use this command
		if (!message.member.permissions.has("MANAGE_GUILD", true)) return

		// get the options
		const options = {
			limit: args[0],
			voiceChannel: message.member.voice.channel,
			maxArgs: 1,
			minArgs: 0
		}

		const autoChannels = await AutoChannels.findOne({ where: {guild_id: message.guild.id}})

		// Check for some basic errors
		// ========================================

		// If auto channels is disabled, ignore the command
		if (autoChannels.get('enabled') === false) return

		// If a channel is set for managing auto channels, ignore if the command is not in that channel
		if (autoChannels.get('channel') !== null && message.channel.id !== autoChannels.get('channel')) return

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
		if (options.voiceChannel.parentID !== autoChannels.get('category')) {
			const responseMessage = new Discord.MessageEmbed()
				.setColor(colors.orange)
				.setDescription(`You are currently not in a manageable voice channel`)
			return message.channel.send(responseMessage).catch(err => {/*do nothing*/})
		}

		// If no amount was specified, set it to the amount of users in the voice channel
		if (options.limit === undefined) options.limit = options.voiceChannel.members.size

		// If the amount specified is not a number, less than 0, or more than 99, abort and notify
		if (isNaN(options.limit) || options.limit > 99 || options.limit < 2) {
			const responseMessage = new Discord.MessageEmbed()
				.setColor(colors.orange)
				.setDescription(`Invalid limit specified, expected a number 2-99`)
			return message.channel.send(responseMessage).catch(err => {/*do nothing*/})
		}

		// If all checks are passed
		// ========================================

		// Set the channel limit, and notify
		options.voiceChannel.setUserLimit(options.limit).then(voiceChannel => {
			const responseMessage = new Discord.MessageEmbed()
				.setColor(colors.green)
				.setDescription(`Limit for the channel **${voiceChannel.name}** now set to **${options.limit}**`)
			return message.channel.send(responseMessage).catch(err => {/*do nothing*/})
		}).catch(err => {
			const responseMessage = new Discord.MessageEmbed()
				.setColor(colors.red)
				.setDescription(`There was an error setting the channel limit`)
			return message.channel.send(responseMessage).catch(err => {/*do nothing*/})
		})

	}
};

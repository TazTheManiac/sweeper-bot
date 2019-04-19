const guildSettings = require('../guild-settings.json')
const colors = require('../colors.json')

module.exports = {
  name: 'lock',
  description: 'Used to limit a channel to a specified amount of users',
  execute(client, message, args) {
    if (!message.member.voice.channel) {
      return client.functions.get('responseMsg').execute(message, colors.yellow, "You need to be in a voice channel to use this command.")
    }

    if (!client.functions.get('categoryCheck').execute(message.member.voice.channel.parentID)) {
      return client.functions.get('responseMsg').execute(message, colors.yellow, "You are not in a lockable channel.")
    }

    if (args.length > 1) {
      return client.functions.get('responseMsg').execute(message, colors.yellow, "This command takes a maximum of one argument.")
    }

    let channelLimit
    if (args.length === 0) channelLimit = message.member.voice.channel.members.size
    if (args.length === 1) channelLimit = args[0]

    if (isNaN(channelLimit)) {
      return client.functions.get('responseMsg').execute(message, colors.yellow, "The argument given must be a number (2-99)")
    }

    if (channelLimit < 2) {
      return client.functions.get('responseMsg').execute(message, colors.yellow, "Can't limit a channel to less than 2 users.")
    }

    if (channelLimit > 99) {
      return client.functions.get('responseMsg').execute(message, colors.yellow, "Can't limit a channel to more than 99 users.")
    }

    message.member.voice.channel.setUserLimit(channelLimit).then(channel => {
      return client.functions.get('responseMsg').execute(message, colors.green, `Limit set to ${channelLimit} users.`)
    }).catch(err => {
      console.log(err);
    })
  }
}

const guildSettings = require('../guild-settings.json')
const colors = require('../colors.json')

module.exports = {
  name: 'unlock',
  description: 'Used to remove the userlimit of a channel',
  execute(client, message, args) {
    if (!message.member.voice.channel) {
      return client.functions.get('responseMsg').execute(message, colors.yellow, "You need to be in a voice channel to use this command.")
    }

    if (!client.functions.get('categoryCheck').execute(message.member.voice.channel.parentID)) {
      return client.functions.get('responseMsg').execute(message, colors.yellow, "You are not in a unlockable channel.")
    }

    if (args.length > 0) {
      return client.functions.get('responseMsg').execute(message, colors.yellow, "This command takes no arguments.")
    }

    message.member.voice.channel.setUserLimit(0).then(channel => {
      return client.functions.get('responseMsg').execute(message, colors.green, `User limit removed.`)
    }).catch(err => {
      console.log(err);
    })
  }
}

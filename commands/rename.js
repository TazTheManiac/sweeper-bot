const guildSettings = require('../guild-settings.json')
const colors = require('../colors.json')

module.exports = {
  name: 'rename',
  description: 'Used to rename a modular channel',
  execute(client, message, args) {
    if (!message.member.voice.channel) {
      return client.functions.get('responseMsg').execute(message, colors.yellow, "You need to be in a voice channel to use this command.")
    }

    if (!client.functions.get('categoryCheck').execute(message.member.voice.channel.parentID)) {
      return client.functions.get('responseMsg').execute(message, colors.yellow, "You are not in a renamable channel.")
    }

    if (args.length > 100) {
      return client.functions.get('responseMsg').execute(message, colors.yellow, "Name cant be longer than 100 characters.")
    }

    let channelName
    if (args.length > 0) {
      channelName = args.join(" ")
    }
    else if (args.length === 0) {
      channelName = `Channel ${message.member.displayName}`
    }

    message.member.voice.channel.setName(channelName).then(channel => {
      return client.functions.get('responseMsg').execute(message, colors.green, `Channel reamed to ${channelName}`).catch(err => {
        console.log(err);
      })
    }).catch(err => {
      console.log(err);
    })
  }
}

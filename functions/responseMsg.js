const Discord = require('discord.js')

module.exports = {
  name: 'responseMsg',
  description: 'Simple function for responding to a message.',
  execute(message, color, response) {
    let responseEmbed = new Discord.MessageEmbed()
      .setColor(color)
      .setDescription(response)
      .setFooter(`@${message.member.displayName}`)

    return message.channel.send(responseEmbed).catch(e => {/*do nothing*/})
  }
}

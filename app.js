// Base stuff
const fs = require('fs')
const Discord = require('discord.js')
const client = new Discord.Client()
const token = require('./token.json')
const guildSettings = require('./guild-settings.json')
const colors = require('./colors.json')

client.commands = new Discord.Collection()
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'))
for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.name, command);
}

client.functions = new Discord.Collection()
const functionFiles = fs.readdirSync('./functions').filter(file => file.endsWith('.js'))
for (const file of functionFiles) {
  const func = require(`./functions/${file}`);
  client.functions.set(func.name, func);
}

// Do When Ready.
// ============================================================
client.on('ready', async () => {
  console.log(`${client.user.username} is online!`)
  client.functions.get('updateActivity').execute(client)
})

client.on('voiceStateUpdate', async (oldMember, newMember) => {

  // Get the channel the user was in, and the channel the user joined.
  // If the user was not previously in a channel or disconnected from a channel,
  // The respective variable will be null.
  const oldChannel = oldMember.channel
  const newChannel = newMember.channel

  // If the user did not change channels, ignore the event
  if (newChannel === oldChannel) return

  // Check if the user left a channel, and if that channel is a modular channel, and that no users is left.
  if (oldChannel !== null && client.functions.get('categoryCheck').execute(oldChannel.parentID) && oldChannel.members.size === 0) {

    // Get all the voice channels in the category.
    let channelCount = 0
    await oldChannel.parent.children.each(channel => {
      if (channel.type === "voice") channelCount ++
    })

    // If there is more than one channel left, delete the old channel.
    if (channelCount > 1) {
      setTimeout(function () {
        oldChannel.delete()
          .catch(err => {console.log(err)})
      }, 500);
    }
  }

  // Check if the user joined a channel, and if that channel is a modular channel.
  // if (newChannel !== null && categoryCheck(newChannel.parentID)) {
  if (newChannel !== null && client.functions.get('categoryCheck').execute(newChannel.parentID) && newChannel.members.size === 1) {
    newChannel.clone({
      name: "Empty Channel", reason: "User joined an empty channel"
    }).then(channel => {
      newChannel.setName(`Channel ${newMember.member.displayName}`).catch(err => {
        console.log(err);
      })
    }).catch(err => {
      console.log(err);
    })
  }
})

client.on('message', message => {
  if (!message.content.startsWith(guildSettings.prefix) || message.author.bot) return

  let args = message.content.slice(guildSettings.prefix.length).split(/ +/)
  let command = args.shift().toLowerCase()

  if (command === `lock`) {
    client.commands.get('lock').execute(client, message, args)
  }

  if (command === `unlock`) {
    client.commands.get('unlock').execute(client, message, args)
  }

  if (command === `rename`) {
    client.commands.get('rename').execute(client, message, args)
  }
})

client.login(token.token);

module.exports = {
  name: 'updateActivity',
  description: 'Sets the bots activity',
  execute(client) {
    let guildSize = client.guilds.size
    if (guildSize === 1) {
      client.user.setActivity(`${client.guilds.size} server`, {type: "WATCHING"}).catch(err => {
        console.log(err);
      })
    } else if (guildSize > 1 || guildSize === 0) {
      client.user.setActivity(`${client.guilds.size} servers`, {type: "WATCHING"}).catch(err => {
        console.log(err);
      })
    }
  }
}

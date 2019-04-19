const guildSettings = require('../guild-settings.json')

module.exports = {
  name: 'categoryCheck',
  description: 'Check if channel is modular',
  execute(categoryID) {
    const autoChannelCatList = guildSettings.autoChannelList
    if (autoChannelCatList.indexOf(categoryID) !== -1) return true
    else return false
  }
}

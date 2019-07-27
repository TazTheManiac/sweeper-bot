// get dependecies
const Discord = require('discord.js');
const recursive = require('recursive-readdir');
const path = require('path');

// exports.appSetup = function (client) {
//
//   // setup events
//   const eventFiles = recursive(path.join(__rootdir, 'events'))
// };

module.exports = async function (client) {

  // setup events
  client.events = new Discord.Collection()
  const eventFiles = await recursive(path.join(__rootdir, 'events'));
  for (eventFile of eventFiles) {
    const event = require(eventFile);
    const name = path.basename(eventFile, '.js')
    client.events.set(name, event)
  };
};

module.exports = {
	name: 'ping',
	description: 'Example layout of a command file',
	execute(message, args) {
		message.channel.send("pong!")
	}
};

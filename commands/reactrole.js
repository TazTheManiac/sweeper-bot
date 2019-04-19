module.exports = {
	name: 'reactrole',
	description: 'Example layout of a command file',
	execute(message, args) {
		if (!message.member.permissions.has("ADMINISTRATOR")) return

		// Create a subcommand from the first argument
		const subCommand = args.shift()

		if (subCommand === "add") {
			const add = require(`${__rootdir}/commands/reactrole/add`)
			add.execute(message, args)
		}
		if (subCommand === "remove") {
			const remove = require(`${__rootdir}/commands/reactrole/remove`)
			remove.execute(message, args)
		}
	}
};

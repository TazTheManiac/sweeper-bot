module.exports = {
	name: 'test',
	description: 'Example layout of a command file',
	execute(message, args) {
		const options = JSON.parse(args.join(" "))
		console.log(options.test);
	}
};

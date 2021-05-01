module.exports = {
	name: 'ping',
	description: 'A simple ping command for easy testing',
	run(message, args) {
		message.channel.send('pong');
	}
};
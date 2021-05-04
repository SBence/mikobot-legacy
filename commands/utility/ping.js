module.exports = {
    name: 'ping',
    description: 'A simple ping command for easy testing',
    async run(message, args) {
        return message.channel.send('pong');
    }
};
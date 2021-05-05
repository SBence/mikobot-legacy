module.exports = {
    name: 'ping',
    description: 'A simple ping command for easy testing',
    protected: true,
    async run(message, args, bot) {
        return message.channel.send('pong');
    }
};
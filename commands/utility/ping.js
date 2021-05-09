module.exports = {
    name: 'ping',
    description: 'A simple ping command for easy testing',
    runInDMs: true,
    protected: true,
    async run(message, args, bot) {
        return message.channel.send('pong');
    }
};

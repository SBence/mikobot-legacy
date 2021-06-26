// Provides the stop command as well

module.exports = {
    name: 'stop',
    aliases: ['clear'],
    description: '',
    async run(message, args, bot) {
        let guildMusic = bot.music[message.guild.id]; // TODO Needs let as it's set to undefined

        if (!guildMusic) return; // TODO
        if (guildMusic.playing) return; // TODO
        if (!guildMusic.queue.length) return; // TODO
        if (!message.member.voice.channel) return; // TODO
        // TODO Check if bot in VC
        // TODO Use this command for queue clearing then instant playing as well

        guildMusic.connection.disconnect();
        guildMusic = undefined; // TODO Check if works, this skips unsetting playing status
    }
};

const ytdl = require('ytdl-core-discord');

module.exports = {
    name: 'play',
    description: '', // TODO
    async run(message, args, bot) {
        const guildMusic = bot.music[message.guild.id];

        if (!guildMusic) return; // TODO
        if (guildMusic.playing) return; // TODO
        if (!guildMusic.queue.length) return; // TODO
        if (!message.member.voice.channel) return; // TODO
        // TODO Check if bot in VC
        // TODO Use this command for queue clearing then instant playing as well

        guildMusic.connection = await message.member.voice.channel.join();
        guildMusic.dispatcher = guildMusic.connection.play(await ytdl(url), { type: 'opus' }, { volume: false });
    }
};

module.exports = {
    name: 'pause',
    description: '',
    async run(message, args, bot) {
        const guildMusic = bot.music[message.guild.id];

        if (!guildMusic) return; // TODO
        if (!guildMusic.playing) return; // TODO
        if (!message.member.voice.channel) return; // TODO

        guildMusic.dispatcher.pause(false); // Don't play silent packets while paused (default behaviour)
        guildMusic.playing = false;
    }
};

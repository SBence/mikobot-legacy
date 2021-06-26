const Discord = require('discord.js');
const secondsToHms = require('../../utils/secondsToHms');

module.exports = {
    name: 'queue',
    description: '',
    async run(message, args, bot) {
        const guildMusic = bot.music[message.guild.id];

        if (guildMusic) return; // TODO
        if (!guildMusic.queue.length) return; // TODO Good check for array emptiness?

        const queueEmbed = new Discord.MessageEmbed()
            .setColor('#ff0000')
            .setTitle(guildMusic.queue[guildMusic.nowPlaying].title)
            .setURL(guildMusic.queue[guildMusic.nowPlaying].url)
            .setDescription(`Length: ${secondsToHms(guildMusic.queue[guildMusic.nowPlaying].duration)}`)
            .setFooter(`Queue: ${guildMusic.nowPlaying + 1} / ${guildMusic.queue.length}`);

        guildMusic.playing ? queueEmbed.setAuthor('▶️ Now playing') : queueEmbed.setAuthor('⏸️ Paused');

        if (guildMusic.queue[guildMusic.nowPlaying + 1]) queueEmbed.addField('Up next', `${secondsToHms(guildMusic.queue[guildMusic.nowPlaying + 1].duration)} - ${guildMusic.queue[guildMusic.nowPlaying + 1].title}`, false);

        if (guildMusic.queue[guildMusic.nowPlaying + 2]) {
            let queueText = [];

            for (let i = 2; i < guildMusic.queue.length; i++) {
                queueText.push(`${secondsToHms(guildMusic.queue[i].duration)} - ${guildMusic.queue[i].title}`);
            }

            queueEmbed.addField('And then...', queueText);
        }

        message.channel.send(queueEmbed);
    }
};

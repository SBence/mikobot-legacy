const Discord = require('discord.js');
const ytdl = require('ytdl-core');
const getGuildConfig = require('../utils/getGuildConfig');

module.exports = {
    name: 'message',
    once: false,
    async run(message, bot) {
        if (message.channel.type !== 'text' || message.author.bot || !message.channel.permissionsFor(bot.user).has('SEND_MESSAGES')) return;

        const regex = /https?:\/\/(?:www\.)?youtu(?:be\.com\/watch\?v=|\.be\/)([a-zA-Z0-9-_]{11})(&(amp;)?[\w?=]*)?/g;
        const videoUrls = message.content.match(regex);
        if (!videoUrls) return;

        if (!await getGuildConfig(message.guild, 'videoinfo')) return; // TODO: Add toggle command so this value can be changed at runtime.

        for (const videoUrl of videoUrls) {
            const info = await ytdl.getBasicInfo(videoUrl);
            const details = info.videoDetails;
            const ytEmbed = new Discord.MessageEmbed()
                .setTitle(details.title)
                .setURL(videoUrl)
                .setAuthor(details.ownerChannelName, details.author.thumbnails[details.author.thumbnails.length - 1].url, details.author.channel_url)
                .setThumbnail(details.thumbnails[details.thumbnails.length - 2].url)
                .setColor('#ff0000');

            if (details.lengthSeconds != 0) ytEmbed.addField('⏱️ Length', secondsToHMS(details.lengthSeconds), true);
            ytEmbed.addField('👁️ Views', parseInt(details.viewCount).toLocaleString('fr-FR'), true);

            if (details.uploadDate === details.publishDate) {
                ytEmbed.addField('📤 Uploaded', details.publishDate, true);
            } else {
                ytEmbed.addFields(
                    { name: '📤 Uploaded', value: details.uploadDate, inline: true },
                    { name: '📢 Published', value: details.publishDate, inline: true }
                );
            }

            if (details.media.artist && details.media.song) ytEmbed.addField('🔊 Audio', `${details.media.artist} - ${details.media.song}`, true); // null needed?
            if (details.media.game) ytEmbed.addField('🎮 Game', details.media.game, true);
            if (details.chapters.length) ytEmbed.addField('🎬 Chapters', details.chapters.length, true);

            message.channel.send(ytEmbed);
        }
        return 0;
    }
};

function secondsToHMS(d) {
    d = Number(d);
    const h = Math.floor(d / 3600);
    const m = Math.floor(d % 3600 / 60);
    const s = Math.floor(d % 3600 % 60);
    const hDisplay = h > 0 ? h + ':' : '';
    const mDisplay = m.toString().padStart(2, '0') + ':';
    const sDisplay = s.toString().padStart(2, '0');
    return hDisplay + mDisplay + sDisplay;
}
// TODO Maybe add checks, maybe switch to guildMusic

const ytdl = require('ytdl-core');

module.exports = {
    name: 'add',
    description: '',
    async run(message, args, bot) {
        const regex = /https?:\/\/(?:www\.)?youtu(?:be\.com\/watch\?v=|\.be\/)([a-zA-Z0-9-_]{11})(&(amp;)?[\w?=]*)?/g;
        const videoUrls = message.content.match(regex);

        if (videoUrls) {
            for (const videoUrl of videoUrls) {
                const info = await ytdl.getBasicInfo(videoUrl);
                const details = info.videoDetails;

                if (!bot.music[message.guild.id]) {
                    bot.music[message.guild.id] = {
                        playing: false,
                        connection: undefined,
                        dispatcher: undefined,
                        nowPlaying: 0,
                        queue: []
                    };
                }

                bot.music[message.guild.id].queue.push({
                    title: details.title,
                    duration: details.lengthSeconds,
                    url: videoUrl
                });
            }
        } else {
            // TODO Search with ytsr here
        }
    }
};

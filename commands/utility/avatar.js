const Discord = require('discord.js');
const getGuildConfig = require('../../utils/getGuildConfig');

module.exports = {
    name: 'avatar',
    aliases: ['pfp'],
    description: 'Sends the mentioned user\'s avatar',
    botPermissions: 'EMBED_LINKS',
    async run(message, args) {
        if (!await getGuildConfig(message.guild, 'avatar')) return; // TODO: Add toggle command so this value can be changed at runtime.

        let users;
        if (!message.mentions.users.size) {
            users = [ message.author ];
        } else {
            users = message.mentions.users.array();
        }
        for (const user of users) {
            const avatar = user.displayAvatarURL({ format: 'png', dynamic: true, size: 4096 });
            message.channel.send(new Discord.MessageEmbed()
                .setTitle('Image link')
                .setURL(avatar)
                .setAuthor(user.tag)
                .setImage(avatar));
        }
        return 0;
    }
};
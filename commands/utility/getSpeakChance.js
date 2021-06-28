const getGuildConfig = require('../../utils/getGuildConfig');

module.exports = {
    name: 'getspeakchance',
    description: '',
    userPermissions: 'MANAGE_SERVER',
    protected: true,
    async run(message, args, bot) {
        try {
            return message.channel.send(`Speaking chance is currently set to \`${await getGuildConfig(message.guild, 'speakchance')}%\``);
        }
        catch (e) {
            message.channel.send('An error has occurred while trying to get the speaking chance.');
            return console.error(e);
        }
    }
};

const Guilds = require('../../models/Guilds');
const getGuildConfig = require('../../utils/getGuildConfig');
const rangeCheck = require('../../utils/rangeCheck');

module.exports = {
    name: 'setspeakchance',
    description: '',
    userPermissions: 'MANAGE_SERVER',
    args: true,
    usage: '<new chance percentage>',
    protected: true,
    async run(message, args, bot) {
        const newChance = parseInt(args[0]);

        if (!rangeCheck(newChance, 0, 100)) {
            return message.channel.send('You must input a number between 1 and 99.');
        }

        try {
            const affectedRows = await Guilds.update({ speakchance: newChance }, { where: { id: message.guild.id } });
            return message.channel.send(`Speaking chance set to \`${await getGuildConfig(message.guild, 'speakchance')}%\``);
        }
        catch (e) {
            message.channel.send('An error has occurred while trying to change the speaking chance.');
            return console.error(e);
        }
    }
};

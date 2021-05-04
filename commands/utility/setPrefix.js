const Guilds = require('../../models/Guilds');
const getGuildConfig = require('../../utils/getGuildConfig');

module.exports = {
    name: 'setprefix',
    description: '',
    guildOnly: true,
    args: true,
    usage: '<new prefix>',
    async run(message, args) {
        try {
            const affectedRows = await Guilds.update({ prefix: args[0] }, { where: { id: message.guild.id } });
            // TODO: Add feedback to user, trim and check for valid input.
            return message.channel.send(`Prefix set to \`${await getGuildConfig(message.guild, 'prefix')}\``);
        }
        catch (e) {
            message.channel.send('An error has occurred while trying to change the prefix.');
            return console.error(e);
        }
    }
};
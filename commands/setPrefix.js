const Guilds = require('../models/Guilds');

module.exports = {
    name: 'setprefix',
    description: '',
    async run(message, args) {
        try {
            const affectedRows = await Guilds.update({ prefix: args[0] }, { where: { id: message.guild.id } });
            // TODO: Add feedback to user, trim and check for valid input.
        }
        catch (e) {
            message.reply('An error has occurred while trying to change the prefix.');
            return console.error(e);
        }
    }
};
const getGuildConfig = require('../../utils/getGuildConfig');
const getCommand = require('../../utils/getCommand');

module.exports = {
    name: 'status',
    description: 'See the state of a specific guild-level setting',
    userPermissions: 'MANAGE_SERVER',
    args: true,
    usage: '<setting>',
    protected: true,
    async run(message, args, bot) {
        const commandName = args[0].toLowerCase();
        const command = getCommand(commandName, bot);

        if (!command) return message.channel.send('I\'m sorry, I can\'t find such a setting.');

        try {
            return message.channel.send(`\`${commandName}\` is currently set to \`${await getGuildConfig(message.guild, command.name)}\``);
        }
        catch (e) {
            message.channel.send(`An error has occurred while trying to get the state of \`${command.name}\`.`);
            return console.error(e);
        }
    }
};

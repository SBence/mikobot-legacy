const Guilds = require('../../models/Guilds');
const getGuildConfig = require('../../utils/getGuildConfig');
const getCommand = require('../../utils/getCommand');

module.exports = {
    name: 'toggle',
    description: 'Toggle server-specific settings',
    userPermissions: 'MANAGE_SERVER',
    args: true,
    usage: '<setting>',
    protected: true,
    async run(message, args, bot) {
        const commandName = args[0].toLowerCase();
        const command = getCommand(commandName, bot);

        if (!command) return message.channel.send('I\'m sorry, I can\'t find such a setting.');

        const updateData = {};
        await getGuildConfig(message.guild, command.name) ? updateData[command.name] = false : updateData[command.name] = true;

        try {
            const affectedRows = await Guilds.update(updateData, { where: { id: message.guild.id } });
            return message.channel.send(`\`${commandName}\` set to \`${await getGuildConfig(message.guild, command.name)}\``);
        }
        catch (e) {
            message.channel.send(`An error has occurred while trying to toggle \`${command.name}\`.`);
            return console.error(e);
        }
    }
};

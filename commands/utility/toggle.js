const Guilds = require('../../models/Guilds');
const getGuildConfig = require('../../utils/getGuildConfig');

module.exports = {
    name: 'toggle',
    description: 'Toggle server-specific settings',
    guildOnly: true,
    userPermissions: 'MANAGE_SERVER',
    args: true,
    usage: '<setting>',
    protected: true,
    async run(message, args, bot) {
        const settingName = args[0].toLowerCase();
        let setting = bot.commands.get(settingName) || bot.commands.find(cmd => cmd.aliases && cmd.aliases.includes(settingName));

        if (!setting || setting.protected) {
            setting = bot.events.get(settingName) || bot.events.find(evt => evt.aliases && evt.aliases.includes(settingName));

            if (!setting || setting.protected) {
                return message.channel.send('I\'m sorry, I can\'t find such a setting.');
            }
        }

        const updateData = {};
        await getGuildConfig(message.guild, setting.name) ? updateData[setting.name] = false : updateData[setting.name] = true;

        try {
            const affectedRows = await Guilds.update(updateData, { where: { id: message.guild.id } });
            return message.channel.send(`\`${settingName}\` set to \`${await getGuildConfig(message.guild, setting.name)}\``);
        }
        catch (e) {
            message.channel.send(`An error has occurred while trying to toggle \`${setting.name}\`.`);
            return console.error(e);
        }
    }
};
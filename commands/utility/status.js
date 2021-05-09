const getGuildConfig = require('../../utils/getGuildConfig');

module.exports = {
    name: 'status',
    description: 'See the state of a specific guild-level setting',
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

        try {
            return message.channel.send(`\`${settingName}\` is currently set to \`${await getGuildConfig(message.guild, setting.name)}\``);
        }
        catch (e) {
            message.channel.send(`An error has occurred while trying to get the state of \`${setting.name}\`.`);
            return console.error(e);
        }
    }
};

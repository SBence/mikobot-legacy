module.exports = (settingName, bot) => {
    let setting = bot.commands.get(settingName) || bot.commands.find(cmd => cmd.aliases && cmd.aliases.includes(settingName));

    if (!setting || setting.protected) {
        setting = bot.events.get(settingName) || bot.events.find(evt => evt.aliases && evt.aliases.includes(settingName));

        if (!setting || setting.protected) {
            return false;
        }
    }

    return setting;
};

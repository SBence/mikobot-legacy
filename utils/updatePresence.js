module.exports = (bot) => {
    if (bot.guilds.cache.array().length === 1) {
        bot.user.setActivity('1 server', { type: 'WATCHING' })
            .then(presence => console.log(`ℹ️ Activity set to ${presence.activities[0].type} ${presence.activities[0].name}`));
    } else {
        bot.user.setActivity(`${bot.guilds.cache.array().length} servers`, { type: 'WATCHING' })
            .then(presence => console.log(`ℹ️ Activity set to ${presence.activities[0].type} ${presence.activities[0].name}`));
    }
};

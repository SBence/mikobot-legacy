const refreshStatus = require('../utils/refreshStatus');

module.exports = {
    name: 'refreshStatusOnGuildCreate',
    on: 'guildCreate',
    once: true,
    protected: true,
    run(bot) { refreshStatus(bot); }
};
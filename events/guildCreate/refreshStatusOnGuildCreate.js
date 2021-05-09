const refreshStatus = require('../../utils/refreshStatus');

module.exports = {
    name: 'refreshStatusOnGuildCreate',
    once: true,
    protected: true,
    run(guild, bot) { refreshStatus(bot); }
};

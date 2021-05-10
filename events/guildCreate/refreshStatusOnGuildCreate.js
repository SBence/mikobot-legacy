const refreshStatus = require('../../utils/refreshStatus');

module.exports = {
    name: 'refreshStatusOnGuildCreate',
    protected: true,
    run(guild, bot) { refreshStatus(bot); }
};

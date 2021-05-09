const refreshStatus = require('../../utils/refreshStatus');

module.exports = {
    name: 'refreshStatusOnGuildDelete',
    once: true,
    protected: true,
    run(guild, bot) { refreshStatus(bot); }
};

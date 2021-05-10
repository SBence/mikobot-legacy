const refreshStatus = require('../../utils/refreshStatus');

module.exports = {
    name: 'refreshStatusOnGuildDelete',
    protected: true,
    run(guild, bot) { refreshStatus(bot); }
};

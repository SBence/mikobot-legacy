const refreshStatus = require('../../utils/refreshStatus');

module.exports = {
    name: 'refreshStatusOnGuildDelete',
    on: 'guildDelete',
    once: true,
    protected: true,
    run(bot) { refreshStatus(bot); }
};

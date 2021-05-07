const refreshStatus = require('../utils/refreshStatus');

module.exports = {
    name: 'refreshStatusOnReady',
    on: 'ready',
    once: true,
    protected: true,
    run(bot) { refreshStatus(bot); }
};
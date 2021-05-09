const refreshStatus = require('../../utils/refreshStatus');

module.exports = {
    name: 'refreshStatusOnReady',
    once: true,
    protected: true,
    run(bot) { refreshStatus(bot); }
};

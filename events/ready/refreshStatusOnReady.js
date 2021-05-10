const refreshStatus = require('../../utils/refreshStatus');

module.exports = {
    name: 'refreshStatusOnReady',
    protected: true,
    run(bot) { refreshStatus(bot); }
};

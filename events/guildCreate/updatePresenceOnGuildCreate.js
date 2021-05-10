const refreshStatus = require('../../utils/updatePresence');

module.exports = {
    name: 'updatepresenceonguildcreate',
    protected: true,
    run(guild, bot) { refreshStatus(bot); }
};

const updatePresence = require('../../utils/updatePresence');

module.exports = {
    name: 'updatepresenceonguilddelete',
    protected: true,
    run(guild, bot) { updatePresence(bot); }
};

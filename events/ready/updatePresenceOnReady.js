const updatePresence = require('../../utils/updatePresence');

module.exports = {
    name: 'updatepresenceonready',
    protected: true,
    run(bot) { updatePresence(bot); }
};

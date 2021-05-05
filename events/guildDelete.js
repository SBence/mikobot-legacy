const Guilds = require('../models/Guilds');

module.exports = {
    name: 'guildDelete',
    on: 'guildDelete',
    once: false,
    protected: true,
    async run(guild, bot) {
        try {
            const rowCount = await Guilds.destroy({ where: { id: guild.id } });
            if (!rowCount) {
                return console.error(`Guild with ID ${guild.id} couldn't be removed from database. This error usually indicates a bug in the bot code, not in Sequelize.`);
            }
            return console.log(`[i] Bot kicked from guild: ${guild.name}, guild deleted from database`);
        }
        catch (e) {
            return console.error(`An error has occurred while trying to remove guild with ID ${guild.id} from database`);
        }
    }
};
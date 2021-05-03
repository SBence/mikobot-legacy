module.exports = {
    name: 'guildDelete',
    once: false,
    async run(guild, bot, database, DataTypes) {
        const Guilds = require('../models/Guilds')(database, DataTypes);
        console.log(`[i] Bot kicked from guild: ${guild.name}\n[i] Deleting from database...`);
        try {
            const rowCount = await Guilds.destroy({ where: { id: guild.id } });
            if (!rowCount) {
                console.error(`Guild with ID ${guildID} couldn't be removed from database. This error usually indicates a bug in the bot code, not in Sequelize.`);
            }
        }
        catch (e) {
            return console.error(`An error has occurred while trying to remove guild with ID ${guild.id} from database`);
        }
    }
};
const Guilds = require('../../models/Guilds');

module.exports = {
    name: 'cleandatabase',
    once: true,
    protected: true,
    async run(bot) {
        console.log('⏳ Cleaning guild database...');
        let removed = 0;
        const guildIDs = bot.guilds.valueOf().map(guild => guild.id);
        try {
            const guildsInDb = await Guilds.findAll({ attributes: ['id'] });
            const orphanedGuildIDs = guildsInDb.map(guild => guild.id).filter(guildID => !guildIDs.includes(guildID));
            for (const guildID of orphanedGuildIDs) {
                const rowCount = await Guilds.destroy({ where: { id: guildID } });
                if (rowCount) {
                    removed++;
                } else {
                    console.error(`⚠️ Guild with ID ${guildID} couldn't be removed from database. This error usually indicates a bug in the bot code, not in Sequelize.`);
                }
            }
            if (removed === 1) {
                console.log(`✅ Cleaned guild database, removed ${removed} guild`);
            } else {
                console.log(`✅ Cleaned guild database, removed ${removed} guilds`);
            }
        }
        catch (e) {
            return console.error('⚠️ An error has occurred while cleaning the database');
        }
        console.log('------------------------------------------------');
    }
};

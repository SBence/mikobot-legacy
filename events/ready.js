module.exports = {
    name: 'ready',
    once: true,
    async run(bot, database, DataTypes) {
        const Guilds = require('../models/Guilds')(database, DataTypes);
        console.log(`Logged in as ${bot.user.tag}\nCleaning guild database...`);
        let deleted = 0;
        const guildIDs = bot.guilds.valueOf().map(guild => guild.id);
        try {
            const guildsInDb = await Guilds.findAll({ attributes: ['id'] });
            const orphanedGuildIDs = guildsInDb.map(guild => guild.id).filter(guildID => !guildIDs.includes(guildID));
            for (guildID of orphanedGuildIDs) {
                const rowCount = await Guilds.destroy({ where: { id: guildID } });
                if (rowCount) {
                    deleted++;
                } else {
                    console.error(`Guild with ID ${guildID} couldn't be removed from database. This error usually indicates a bug in the bot code, not in Sequelize.`);
                }
            }
            if (deleted === 1) {
                console.log(`Deleted ${deleted} guild`);
            } else {
                console.log(`Deleted ${deleted} guilds`);
            }
        }
        catch (e) {
            return console.error('An error has occurred while cleaning the database');
        }
        console.log('------------------------------');
    }
};
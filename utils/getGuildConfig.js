const Guilds = require('../models/Guilds');

module.exports = async (guild, config) => {
    const guildEntry = await Guilds.findOne({ where: { id: guild.id } });
    let value;
    if (guildEntry) {
        value = guildEntry.get(config);
    } else {
        try {
            const newGuild = await Guilds.create({
                id: guild.id
            });
            value = newGuild.get(config);
            console.log(`---------------------------[i]\nNew guild added to database\nName: ${guild.name}\nID: ${guild.id}\n---------------------------[i]`);
        }
        catch (e) {
            // message.reply('A database error has occurred while trying to run your command.');
            if (e.name === 'SequelizeUniqueConstraintError') {
                return console.error(`A guild entry with a matching ID (${guild.id}) already exists in the database. This error usually indicates a bug in the bot code, not in Sequelize.`);
            }
            return console.error(`An error has occurred adding the guild entry to the database with the following ID: ${guild.id}`);
        }
    }
    return value;
}
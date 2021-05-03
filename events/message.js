module.exports = {
    name: 'message',
    once: false,
    async run(message, bot, database, DataTypes) {
        const Guilds = require('../models/Guilds')(database, DataTypes);
        const guildEntry = await Guilds.findOne({ where: { id: message.guild.id } });
        let prefix;

        if (guildEntry) {
            prefix = guildEntry.get('prefix');
        } else {
            try {
                const newGuild = await Guilds.create({
                    id: message.guild.id
                });
                prefix = newGuild.get('prefix');
                console.log(`---------------------------[i]\nNew guild added to database\nName: ${message.guild.name}\nID: ${message.guild.id}\n---------------------------[i]`);
            }
            catch (e) {
                message.reply('A database error has occurred while trying to run your command.');
                if (e.name === 'SequelizeUniqueConstraintError') {
                    return console.error(`A guild entry with a matching ID (${message.guild.id}) already exists in the database. This error usually indicates a bug in the bot code, not in Sequelize.`);
                }
                return console.error(`An error has occurred adding the guild entry to the database with the following ID: ${message.guild.id}`);
            }
        }

        if (!message.content.startsWith(prefix) || message.author.bot) return;
        const args = message.content.slice(prefix.length).trim().split(/ +/);
        const command = args.shift().toLowerCase();
        if (!bot.commands.has(command)) return;

        try {
            bot.commands.get(command).run(message, args, database, DataTypes);
        } catch (error) {
            console.error(error);
            message.reply('There was an error trying to run that command.');
        }
    }
};
const fs = require('fs');
const Discord = require('discord.js');
const Sequelize = require('sequelize');
const bot = new Discord.Client();
bot.commands = new Discord.Collection();
const config = require('./config/global.json');
const { token } = require('./config/token.json');

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'));

loadFiles(commandFiles, eventFiles);

const database = new Sequelize('database', 'username', 'password', {
    host: 'localhost',
    dialect: 'sqlite',
    logging: false,
    storage: 'config/database.sqlite'
});

const Guilds = require('./models/Guilds')(database, Sequelize.DataTypes);

console.log('Syncing guild database...');
Guilds.sync();

bot.on('message', async message => {
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
            console.log(`[i]-----------------------------\nNew guild added to database\nName: ${message.guild.name}\nID: ${message.guild.id}\n[i]-----------------------------`);
        }
        catch (e) {
            message.reply('A database error has occurred while trying to run your command.');
            if (e.name === 'SequelizeUniqueConstraintError') {
                return console.log(`A guild entry with a matching ID (${message.guild.id}) already exists in the database. This error usually indicates a bug in the bot code, not in Sequelize.`);
            }
            return console.log(`An error has occurred adding the guild entry to the database with the following ID: ${message.guild.id}`);
        }
    }

    if (!message.content.startsWith(prefix) || message.author.bot) return;
    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const command = args.shift().toLowerCase();
    if (!bot.commands.has(command)) return;

    try {
        bot.commands.get(command).run(message, args, database, Sequelize.DataTypes);
    } catch (error) {
        console.error(error);
        message.reply('There was an error trying to run that command.');
    }
});

bot.login(token);

function loadFiles(commandFiles, eventFiles) {
    let loadedCommands = 0, loadedEvents = 0;
    for (const file of commandFiles) {
        const command = require(`./commands/${file}`);
        bot.commands.set(command.name, command);
        loadedCommands++;
    }
    for (const file of eventFiles) {
        const event = require(`./events/${file}`);
        if (event.once) {
            bot.once(event.name, (...args) => event.execute(...args, bot));
        } else {
            bot.on(event.name, (...args) => event.execute(...args, bot));
        }
        loadedEvents++;
    }
    console.log(`Loaded commands: ${loadedCommands}\nLoaded event handlers: ${loadedEvents}`);
}
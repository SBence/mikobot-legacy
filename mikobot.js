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

const database = new Sequelize('database', 'user', 'password', {
    host: 'localhost',
    dialect: 'sqlite',
    logging: false,
    storage: 'config/database.sqlite'
});

const Guilds = database.define('guilds', {
    id: {
        type: Sequelize.STRING,
        primaryKey: true
    },
    prefix: {
        type: Sequelize.STRING,
        defaultValue: 'm.',
        allowNull: false
    }
});

console.log('Syncing guild database...');
Guilds.sync();

bot.on('message', message => {
    if (!message.content.startsWith(config.prefix) || message.author.bot) return;
    const args = message.content.slice(config.prefix.length).trim().split(/ +/);
    const command = args.shift().toLowerCase();
    if (!bot.commands.has(command)) return;
    try {
        bot.commands.get(command).run(message, args);
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
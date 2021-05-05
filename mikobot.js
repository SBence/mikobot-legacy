const fs = require('fs');
const Discord = require('discord.js');
const bot = new Discord.Client();
bot.commands = new Discord.Collection();
bot.events = new Discord.Collection();

console.log('------Welcome to MikoBot------\nLoading files...');

const { token } = require('./config/token.json');

loadFiles();

const Guilds = require('./models/Guilds');

console.log('Syncing guild database...');
Guilds.sync({ alter: true });

bot.login(token);

function loadFiles() {
    let loadedCommands = 0, loadedEvents = 0;

    const commandFolders = fs.readdirSync('./commands');
    for (const folder of commandFolders) {
        const commandFiles = fs.readdirSync(`./commands/${folder}`).filter(file => file.endsWith('.js'));
        for (const file of commandFiles) {
            const command = require(`./commands/${folder}/${file}`);
            bot.commands.set(command.name, command);
            loadedCommands++;
        }
    }

    const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'));
    for (const file of eventFiles) {
        const event = require(`./events/${file}`);
        bot.events.set(event.name, event);
        if (event.once) {
            bot.once(event.on, (...args) => event.run(...args, bot));
        } else {
            bot.on(event.on, (...args) => event.run(...args, bot));
        }
        loadedEvents++;
    }

    console.log(`Loaded commands: ${loadedCommands}\nLoaded event handlers: ${loadedEvents}`);
}
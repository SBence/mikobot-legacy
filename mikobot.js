const fs = require('fs');
const Discord = require('discord.js');
const bot = new Discord.Client();
bot.commands = new Discord.Collection();

console.log('------Welcome to MikoBot------\nLoading files...')

const config = require('./config/global.json');
const { token } = require('./config/token.json');

const commandFolders = fs.readdirSync('./commands');
const eventFolders = fs.readdirSync('./events').filter(file => file.endsWith('.js'));

loadFiles(commandFolders, eventFolders);

const Guilds = require('./models/Guilds');

console.log('Syncing guild database...');
Guilds.sync({ alter: true });

bot.login(token);

function loadFiles(commandFiles, eventFiles) {
    let loadedCommands = 0, loadedEvents = 0;
    for (const folder of commandFolders) {
        const commandFiles = fs.readdirSync(`./commands/${folder}`).filter(file => file.endsWith('.js'));
        for (const file of commandFiles) {
            const command = require(`./commands/${folder}/${file}`);
            bot.commands.set(command.name, command);
            loadedCommands++;
        }
    }
    for (const file of eventFiles) {
        const event = require(`./events/${file}`);
        if (event.once) {
            bot.once(event.name, (...args) => event.run(...args, bot));
        } else {
            bot.on(event.name, (...args) => event.run(...args, bot));
        }
        loadedEvents++;
    }
    console.log(`Loaded commands: ${loadedCommands}\nLoaded event handlers: ${loadedEvents}`);
}
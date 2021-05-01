const Discord = require('discord.js');
const fs = require('fs');
const bot = new Discord.Client();
bot.commands = new Discord.Collection();
const config = require('./config/global.json');
const { token } = require('./config/token.json');
const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'));

loadFiles(fs.readdirSync('./commands').filter(file => file.endsWith('.js')));

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

function loadFiles(commandFiles) {
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
const fs = require('fs');
const Discord = require('discord.js');
const bot = new Discord.Client();
bot.commands = new Discord.Collection();
bot.events = new Discord.Collection();

console.log('---------------Welcome to MikoBot---------------\n⏳ Loading files...');
loadFiles();

console.log('⏳ Syncing guild database...');
require('./models/Guilds').sync({ alter: true }).then(async () => {
    console.log('✅ Synced guild database\n⏳ Logging in...');

    await bot.login(require('./config/token.json').token);
    console.log(`✅ Logged in as ${bot.user.tag}`);
});

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

    const eventFolders = fs.readdirSync('./events');

    for (const folder of eventFolders) {
        const eventFiles = fs.readdirSync(`./events/${folder}`).filter(file => file.endsWith('.js'));
        for (const file of eventFiles) {
            const event = require(`./events/${folder}/${file}`);

            if (event.once) {
                bot.once(folder, (...args) => event.run(...args, bot));
            } else {
                bot.on(folder, (...args) => event.run(...args, bot));
            }

            bot.events.set(event.name, event);
            loadedEvents++;
        }
    }

    console.log(`✅ Loaded ${loadedCommands} commands and ${loadedEvents} event handlers`);
}

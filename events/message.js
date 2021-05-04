const getGuildConfig = require('../utils/getGuildConfig');

module.exports = {
    name: 'message',
    once: false,
    async run(message, bot) {
        const prefix = await getGuildConfig(message.guild, 'prefix');

        if (!message.content.startsWith(prefix) || message.author.bot) return;

        const args = message.content.slice(prefix.length).trim().split(/ +/);

        const commandName = args.shift().toLowerCase();
        const command = bot.commands.get(commandName) || bot.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
        if (!command) return;

        if (command.guildOnly && message.channel.type === 'dm') {
            return message.reply('Nope, that doesn\'t make sense in DMs.');
        }

        if (command.permissions) {
            const authorPerms = message.channel.permissionsFor(message.author);
            if (!authorPerms || !authorPerms.has(command.permissions)) {
                return message.reply('I\'m afraid you don\'t possess the necessary permissions to perform this action.');
            }
        }

        if (command.args && !args.length) {
            let reply = `${message.member.displayName}, look, we *need* some arguments here if we wanna do something.`;
            if (command.usage) {
                reply += `\n*ahem*\nThe *proper* usage would be: \`${prefix}${command.name} ${command.usage}\``;
            }
            return message.channel.send(reply);
        }

        try {
            return command.run(message, args);
        } catch (error) {
            console.error(error);
            return message.channel.send('An error has occurred while trying to run that command.');
        }
    }
};
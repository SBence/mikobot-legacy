const getGuildConfig = require('../../utils/getGuildConfig');

module.exports = {
    name: 'commandHandler',
    once: false,
    protected: true,
    async run(message, bot) {
        let prefix = '';

        if (message.channel.type !== 'dm') {
            if (!message.channel.permissionsFor(bot.user).has('SEND_MESSAGES')) return;
            prefix = await getGuildConfig(message.guild, 'prefix');
        }

        if (!message.content.startsWith(prefix) || message.author.bot) return;

        const args = message.content.slice(prefix.length).trim().split(/ +/);
        const commandName = args.shift().toLowerCase();
        const command = bot.commands.get(commandName) || bot.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

        if (!command) return;

        if (command.guildOnly && message.channel.type === 'dm') {
            return message.channel.send('Nope, that doesn\'t make sense in DMs.');
        }

        if (!command.protected && !await getGuildConfig(message.guild, command.name)) return;

        if (command.userPermissions) {
            const authorPermissions = message.channel.permissionsFor(message.author);
            if (!authorPermissions || !authorPermissions.has(command.userPermissions)) {
                return message.channel.send('I\'m afraid you don\'t possess the necessary permissions to perform this action.');
            }
        }

        if (command.botPermissions) {
            const currentBotPermissions = message.channel.permissionsFor(bot.user);
            if (!currentBotPermissions || !currentBotPermissions.has(command.botPermissions)) {
                return message.channel.send('It seems I don\'t have the permission(s) to do that.');
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
            return command.run(message, args, bot);
        } catch (error) {
            console.error(error);
            return message.channel.send('An error has occurred while trying to run that command.');
        }
    }
};

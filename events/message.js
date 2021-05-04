const getGuildConfig = require('../utils/getGuildConfig');

module.exports = {
    name: 'message',
    once: false,
    async run(message, bot) {
        const prefix = await getGuildConfig(message.guild, 'prefix');

        if (!message.content.startsWith(prefix) || message.author.bot) return;

        const args = message.content.slice(prefix.length).trim().split(/ +/);

        const commandName = args.shift().toLowerCase();
        if (!bot.commands.has(commandName)) return;
        const command = bot.commands.get(commandName);

        if (command.args && !args.length) {
            return message.channel.send(`${message.member.displayName}, look, we *need* some arguments here if we wanna do something.`);
        }

        try {
            return command.run(message, args);
        } catch (error) {
            console.error(error);
            return message.channel.send('An error has occurred while trying to run that command.');
        }
    }
};
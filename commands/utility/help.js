const getGuildConfig = require('../../utils/getGuildConfig');

module.exports = {
    name: 'help',
    description: 'Get help on command usage',
    usage: '<command name>',
    runInDMs: true,
    protected: true,
    async run(message, args, bot) {
        const data = [];
        const { commands } = message.client;
        const prefix = message.channel.type === 'dm' ? '' : await getGuildConfig(message.guild, 'prefix');

        if (!args.length) {
            data.push('Here\'s a list of all my commands:');
            data.push(`**${commands.map(command => command.name).join(', ')}**`);
            data.push('\n*Reply with `help <command name>` to get info on a specific command.*');

            return message.author.send(data, { split: true })
                .then(() => {
                    if (message.channel.type === 'dm') return;
                    message.channel.send('I\'ve sent you a DM with all my commands.');
                })
                .catch(error => {
                    console.error(`Could not send help DM to ${message.author.tag}\n`, error);
                    message.channel.send(`Umm, ${message.author.tag}, it seems like I can\'t DM you. Maybe you have DMs disabled?`);
                });
        }

        const name = args[0].toLowerCase();
        const command = commands.get(name) || commands.find(c => c.aliases && c.aliases.includes(name));

        if (!command) {
            return message.channel.send('I\'m afraid I can\'t find such a command.');
        }

        data.push(`**Name:** ${command.name}`);

        if (command.aliases) data.push(`**Aliases:** ${command.aliases.join(', ')}`);
        if (command.description) data.push(`**Description:** ${command.description}`);
        if (command.usage) data.push(`**Usage:** ${prefix}${command.name} ${command.usage}`);

        message.channel.send(data, { split: true });
    }
};

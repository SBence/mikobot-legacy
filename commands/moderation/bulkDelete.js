const getGuildConfig = require('../../utils/getGuildConfig');

module.exports = {
    name: 'prune',
    description: 'Bulk delete messages',
    args: true,
    usage: '<number of messages to delete>',
    async run(message, args) {
        if (!await getGuildConfig(message.guild, 'bulkdelete')) return; // TODO: Add toggle command so this value can be changed at runtime.

        const amount = parseInt(args[0]) + 1;

        if (isNaN(amount)) {
            return message.channel.send('Invalid number.');
        } else if (amount < 2 || amount > 100) {
            return message.channel.send('You must input a number between 1 and 99.');
        }

        message.channel.bulkDelete(amount, true).catch(err => {
            console.error(err);
            return message.channel.send('An error has occurred trying to prune messages.');
        });
    }
};
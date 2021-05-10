module.exports = {
    name: 'bulkdelete',
    aliases: ['batchdelete', 'prune'],
    description: 'Bulk delete messages',
    userPermissions: 'MANAGE_MESSAGES',
    botPermissions: 'MANAGE_MESSAGES',
    args: true,
    usage: '<number of messages to delete>',
    async run(message, args, bot) {
        const amount = parseInt(args[0]) + 1;

        if (isNaN(amount)) {
            return message.channel.send('Invalid number.');
        } else if (amount < 2 || amount > 100) {
            return message.channel.send('You must input a number between 1 and 99.');
        }

        message.channel.bulkDelete(amount, true).catch(e => {
            console.error(e);
            return message.channel.send('An error has occurred trying to prune messages.');
        });
    }
};

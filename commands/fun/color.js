const getGuildConfig = require('../../utils/getGuildConfig');

module.exports = { // TODO: Add permission check.
    name: 'color',
    aliases: ['colour', 'setcolor', 'setcolour'],
    description: 'Sets your name color to the supplied hexadecimal color value\nSupplying an invalid color value will remove your current name color',
    guildOnly: true,
    args: true,
    usage: '<hexadecimal color>',
    async run(message, args) {
        if (!await getGuildConfig(message.guild, 'color')) return; // TODO: Add toggle command so this value can be changed at runtime.

        let color;
        const colorMatches = args[0].match('^#?[A-Fa-f0-9]{6}$');
        if (colorMatches) color = colorMatches[0];

        if (!color) {
            const colorRole = message.guild.roles.cache.find(role => role.name === message.author.id);
            return colorRole ? colorRole.delete() : 0;
        }

        const roleName = message.author.id;
        const colorRole = message.guild.roles.cache.find(role => role.name === roleName);
        if (colorRole) { return colorRole.setColor(color); } else {
            const role = await message.guild.roles.create({
                data: {
                    name: roleName,
                    color: color,
                    hoist: false,
                    permissions: [],
                    mentionable: false
                }
            });
            return message.member.roles.add(role);
        }
    }
};
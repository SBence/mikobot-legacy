const markovChain = require('markov-strings').default;
const Guilds = require('../models/Guilds');

function condition(message, bot) {
    const chance = 0; // TODO: Add a guild database column for this.
    const realChance = 100 / chance;
    return message.mentions.has(bot.user) || !Math.floor(Math.random() * realChance) && !message.author.bot
}

const markovOptions = {
    maxTries: 3000,
    prng: Math.random,
    filter: (result) => {
        return ((result.score >= 7) &&
            (!(result.string.includes('@'))) &&
            (result.string.length <= 2000));
    }
};

module.exports = {
    name: 'message',
    once: false,
    async run(message, bot) {
        if (!condition(message, bot)) return;

        const guildEntry = await Guilds.findOne({ where: { id: message.guild.id } });
        let speakEnabled; // TODO: Add toggle command so this value can be changed at runtime.

        if (guildEntry) {
            speakEnabled = guildEntry.get('speak');
        } else {
            try {
                const newGuild = await Guilds.create({
                    id: message.guild.id
                });
                speakEnabled = newGuild.get('speak');
                console.log(`---------------------------[i]\nNew guild added to database\nName: ${message.guild.name}\nID: ${message.guild.id}\n---------------------------[i]`);
            }
            catch (e) {
                message.reply('A database error has occurred while trying to run your command.');
                if (e.name === 'SequelizeUniqueConstraintError') {
                    return console.error(`A guild entry with a matching ID (${message.guild.id}) already exists in the database. This error usually indicates a bug in the bot code, not in Sequelize.`);
                }
                return console.error(`An error has occurred adding the guild entry to the database with the following ID: ${message.guild.id}`);
            }
        }

        if (!speakEnabled) return;

        message.channel.startTyping();
        const messages = await getMessages(message.channel, 1000);
        const chain = new markovChain({ stateSize: 2 });
        chain.addData(messages.map(msg => msg.content));
        const result = chain.generate(markovOptions);
        message.channel.stopTyping();

        if (result) {
            return message.channel.send(result.string);
        } else {
            console.log('Markov string generation failed.');
            return message.channel.send('I literally have no words. Wow.');
        }
    }
}

async function getMessages(channel, limit) {
    limit = limit * 2;
    const out = [];
    if (limit <= 100) {
        const messages = await channel.messages.fetch({ limit: limit });
        out.push(...messages.array());
    } else {
        const rounds = (limit / 100) + (limit % 100 ? 1 : 0);
        let last_id = '';
        for (let x = 0; x < rounds; x++) {
            const options = {
                limit: 100
            };
            if (last_id.length > 0) {
                options.before = last_id;
            }
            const messages = await channel.messages.fetch(options);
            out.push(...messages.array());
            const lastMessage = messages.array()[(messages.array().length - 1)];
            if (lastMessage != null) {
                last_id = lastMessage.id;
            }
        }
    }
    return out;
}
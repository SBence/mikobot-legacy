const markovChain = require('markov-strings').default;
const getGuildConfig = require('../utils/getGuildConfig');

async function conditionsMet(message, bot) {
    if (message.channel.type !== 'text') return false;
    if (message.author.bot) return false;
    if (!message.channel.permissionsFor(bot.user).has('SEND_MESSAGES')) return false;
    if (!await getGuildConfig(message.guild, 'speak')) return false;
    if (message.mentions.has(bot.user)) return true;
    const chance = await getGuildConfig(message.guild, 'speakchance'); // TODO: Add set command so this value can be changed at runtime.
    if (chance === 0) return false;
    if (!Math.floor(Math.random() * 100 / chance)) return true;
    return false;
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
    name: 'speak',
    on: 'message',
    once: false,
    async run(message, bot) {
        if (!await conditionsMet(message, bot)) return;

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
};

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
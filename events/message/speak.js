const markovChain = require('markov-strings').default;
const getGuildConfig = require('../../utils/getGuildConfig');

async function conditionsMet(message, bot) {
    if (message.channel.type !== 'text') return false;
    if (message.author.bot) return false;
    if (!message.channel.permissionsFor(bot.user).has('SEND_MESSAGES')) return false;
    if (!await getGuildConfig(message.guild, 'speak')) return false;
    if (message.mentions.has(bot.user)) return true;
    if (!await getGuildConfig(message.guild, 'randomspeak')) return false;
    if (!Math.floor(Math.random() * 1000 / getGuildChance(message.guild))) return true;
    return false;
}

const guildChances = {};

function getGuildChance(guild) {
    if (guildChances[guild.id] === undefined) { guildChances[guild.id] = 1; }
    return guildChances[guild.id]++;
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
    async run(message, bot) {
        if (!await conditionsMet(message, bot)) return;

        guildChances[message.guild.id] = 0;

        message.channel.startTyping();
        const messages = (await getMessages(message.channel, 500)).filter(msg => !msg.author.bot);
        const chain = new markovChain({ stateSize: 2 });
        chain.addData(messages.map(msg => msg.content));

        try {
            await message.channel.send(chain.generate(markovOptions).string);
        } catch (error) {
            return;
        } finally {
            message.channel.stopTyping();
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
        for (let x = 0; x < rounds; ++x) {
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

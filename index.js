const Discord = require('discord.js');
const config = require('./config');

const client = new Discord.Client({
    fetchAllMembers: true,
    partials: ["MESSAGE", "CHANNEL", "GUILD_MEMBER", "USER", "REACTION"],
    ws: {
        intents: Discord.Intents.ALL
    }
});
client.commands = new Discord.Collection();
require('./utils/functions')(client);

client.log('\n-----====================-----');
client.Load.events(client)
client.Load.commands(client)
client.login(config.token);
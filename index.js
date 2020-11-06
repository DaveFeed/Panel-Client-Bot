//#region Variables
const Discord = require('discord.js');
const config = require('./config');
const {
    Builder
} = require('pterodactyl.js');
global.pteroclient = new Builder(config.host, config.api_token).asUser();

global.pteroclient.testConnection()
    .then(e => {
        client.log("Logged in to PteroClient successfully!")
        global.pterologged = true;
    })
    .catch(e => {
        client.log("Failed to login to PteroClient!")
        global.pterologged = false;
    });
const client = new Discord.Client({
    fetchAllMembers: true,
    ws: {
        intents: Discord.Intents.ALL
    }
});
client.commands = new Discord.Collection();

const fs = require('fs');
if (!fs.existsSync('./logs'))
    fs.mkdirSync('./logs');
require('./utils/functions')(client);
global.logname = require('moment-timezone')(new Date()).tz(config.timezone).format('DD-MM-YYYY__HH-mm-ss');
fs.writeFileSync(`./logs/${logname}.log`, "", (err) => {
    if (err) client.log(err);
});
//#endregion

//#region Setup
client.log('\n-----====================-----');

//Loading Events and Commands
client.Load.events(client)
client.Load.commands(client)
//#endregion
client.login(config.token);
process.on('unhandledRejection', (e) => {
    client.log(`Unhandled Rejection`)
    client.log(e)
})



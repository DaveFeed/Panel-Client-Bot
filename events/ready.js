const config = require('../config');
const chalk = require('chalk');
const fs = require('fs');

module.exports = async client => {
    client.log(`[Bot Started] [Date: ${client.FormatDate(Date.now())}]`, chalk.gray);
    client.log(`> Logged in as "${client.user.tag}"!`, chalk.green);
    if (config.generateInvites)
        client.generateInvite(["ADMINISTRATOR"]).then(link => {
            client.log("Invite Link: " + link);
        })
    if (global.pterologged === undefined)
        client.user.setPresence({
            activity: {
                name: `Waiting...`
            }
        })
        
    client.UpdateServers();
    global.monitorInterval = setInterval(
        () => {
            client.UpdateServers();
        },
        config.ServerUpdate * 1000
    )
};
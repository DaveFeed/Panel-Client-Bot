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
    setInterval(() => {
        if (global.pterologged)
            client.user.setPresence({
                activity: {
                    name: `Logged in`
                }
            })
        else client.user.setPresence({
            activity: {
                name: `Not Logged in`
            }
        })
    }, 15000)

};
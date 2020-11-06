const fs = require('fs');
const chalk = require('chalk')

module.exports = (client, member) => {
    if (member.user.bot) return;
    else member.ban({
        reason: "You are not in the whitelist!"
    });
};
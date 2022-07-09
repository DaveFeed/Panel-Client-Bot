const Discord = require('discord.js');
const ipinfo = require('ipinfo')
const config = require('../config')

module.exports.run = async (client, message, args) => {
    let info;
    if (!args[0]) {
        info = await ipinfo(undefined,config.ipinfo_token);
        console.log(info)
        return message.channel.send(
            new Discord.MessageEmbed()
            .setColor(config.Colors.Success)
            .setDescription(`**IP** : ${info.ip}\
            \n**City** : ${info.city}\
            \n**Region** : ${info.region}\
            \n**Country** : ${info.country}\
            \n**Timezone** : ${info.timezone}\
            \n**Location** : [Click Me]( https://www.google.com/maps/@${info.loc},14z )`));
    }
    if(!ipinfo.IP_REGEX.test(args[0]))
    return message.channel.send(":x: | The IP adress is in wrong format, it has to be in range of 0-255, and in format 1.1.1.1")
    info = await ipinfo(args[0], config.ipinfo_token)
    return message.channel.send(
        new Discord.MessageEmbed()
        .setColor(config.Colors.Success)
        .setDescription(`**IP** : ${info.ip}\
        \n**City** : ${info.city}\
        \n**Region** : ${info.region}\
        \n**Country** : ${info.country}\
        \n**Timezone** : ${info.timezone}\
        \n**Location** : [Click Me]( https://www.google.com/maps/@${info.loc},14z )`));
};

module.exports.help = {
    name: "ip",
    description: `Get IP information.`,
    usage: `ip`,
    category: `Other`
}
const Discord = require('discord.js');
const fs = require('fs')
const config = require(`../config`);

module.exports.run = async (client, message, args) => {
    let obj = {};
    const commands = fs.readdirSync(`./commands/`).filter((file) =>
        file.endsWith(".js")
    );
    commands.forEach(command => {
        let data = require(`./${command}`)
        if (!obj[data.help.category]) obj[data.help.category] = []
        obj[data.help.category].push(`\`${data.help.name}\``);
    });
    let categories = Object.keys(obj).map(data => {
        return {
            name: data,
            value: obj[data].join(', ')
        };
    });
    const embed = new Discord.MessageEmbed()
        .setTitle("Help")
        .setColor(config.Colors.Waiting)
        .setThumbnail(client.user.displayAvatarURL())
        .setDescription(
            `Prefix: \`${config.prefix}\`\
            \nWhitelist: <@${config.allowedIDs.join('>,<@')}>\
            \nUse \`${config.prefix}[command] help\` to get information about the command.`
        )
        .addFields(categories)
        .setTimestamp()
    return message.channel.send(embed);
}

module.exports.help = {
    name: "help",
    description: `Shows info about commands.`,
    usage: `help`,
    category: `Other`
}
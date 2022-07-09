const config = require('../config');
const chalk = require('chalk');
const Discord = require('discord.js');

module.exports = (client, message) => {
    if (message.author.bot) return;
    if (message.content.trim() == `<@!${client.user.id}>`)
        return message.channel.send(`**Prefix :** \`${config.prefix}\``)
    if (message.content.indexOf(config.prefix) !== 0) return;

    const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();

    const cmd = client.commands.get(command);
    if (!cmd) return;

    client.log(`[Date: ${client.FormatDate(message.createdTimestamp)}] [Guild] [AuthorId: ${message.author.id}] [${command}] {${args.join(' ')}}`);
    if (args[0] && args[0].toLowerCase() == 'help' && cmd.help.description)
        return message.channel.send(
            new Discord.MessageEmbed()
                .setTitle(`Help for command \`${command[0].toUpperCase()}${command.slice(1)}\``)
                .setColor(config.Colors.Waiting)
                .setDescription(cmd.help.description)
                .addField('Category', `\`${cmd.help.category}\``)
                .addField('Usage', `\`${config.prefix}${cmd.help.usage}\``)
                .setTimestamp()
        )
    cmd.run(client, message, args).catch(o_O => {
        console.log("Code better you weirdo: "+o_O.stack)
    });
};
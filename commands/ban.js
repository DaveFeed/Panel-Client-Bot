const Discord = require('discord.js');
const config = require(`../config`);

module.exports.run = async (client, message, args) => {
    if (!message.member.hasPermission('BAN_MEMBERS')) return;

    let rUser = message.guild.member(message.mentions.users.first() || message.guild.members.cache.get(args[0]));
    if (!rUser) return message.channel.send(`:x: | You didn't choose anyone!`)

    let authorHighestRole = message.member.roles.highest.position;
    let mentionHighestRole = rUser.roles.highest.position;

    if (mentionHighestRole >= authorHighestRole)
        return message.channel.send(':x: | You don\'t have the rights to ban this member!')

    if (!rUser.bannable)
        return message.channel.send(':x: | I don\'t have the rights to ban this member!');

    let reason = args.splice(1).join(' ') || "No Reason";
    await rUser.ban({
        reason: reason
    })
    return message.channel.send(new Discord.MessageEmbed()
        .setTitle(":hammer: | Ban hammer has been Slamed!")
        .setDescription(`:x: | Member <@${rUser.id}> has been banned! | :x:`)
        .setColor(config.Colors.Failure)
        .addFields({
            name: `Banned`,
            value: `<@${message.author.id}>`
        }, {
            name: `Reason`,
            value: reason
        }))
};

module.exports.help = {
    name: "ban",
    description: `To Ban somebody.`,
    usage: `ban [Member] {Reason}`,
    category: `Moderation`
}
const Discord = require('discord.js');
const config = require(`../config`);
const pteroclient = require(`../utils/client`);

module.exports.run = async (client, message, args) => {
    if (!global.pterologged) return message.channel.send(':x: | You are not logged in!')
    let msg = await message.channel.send(new Discord.MessageEmbed()
        .setTitle("Fetching Data...")
        .setColor(config.Colors.Waiting)
        .setDescription("This might take some time."))

    pteroclient.getAccount(config.host, config.api_token).then(async info => {
        let embed = new Discord.MessageEmbed()
            .setTitle(`Account "${info.username}" ${info.admin?'(ADMIN)':''}`)
            .setColor(config.Colors.Success)
            .setDescription(`ID: \`${info.id}\`\
            \nName: ${info.first_name} ${info.last_name}\
            \nEmail: ${info.email}`);
        msg.edit(embed);
    }).catch(error => msg.edit(new Discord.MessageEmbed()
        .setTitle("An Error has occured!")
        .setColor(config.Colors.Failure)
        .setDescription("I think i might be coded wrongly!")).then(() => {
        throw error
    }));
}
module.exports.help = {
    name: "account",
    description: `Shows account details.`,
    usage: `account`,
    category: `Panel`
}
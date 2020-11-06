const Discord = require('discord.js');
const config = require(`../config`);

module.exports.run = async (client, message, args) => {
    if (!global.pterologged) return message.channel.send(':x: | You are not logged in!')
    let msg = await message.channel.send(new Discord.MessageEmbed()
        .setTitle("Fetching Data...")
        .setColor(config.Colors.Waiting)
        .setDescription("This might take some time."))
    global.pteroclient.getClientServers().then(async servers => {
        let embed = new Discord.MessageEmbed()
            .setTitle("Your Servers")
            .setColor(config.Colors.Listing);
        for (let i = 0; i < servers.length; i++) {
            let server = servers[i];
            embed.addField(`${server.name} ${server.serverOwner?"(Owner)":"(Member)"}`,
                `\`\`\`ID: ${server.identifier}\`\`\``
            );
        }
        msg.edit(embed);
    }).catch(error => msg.edit(new Discord.MessageEmbed()
        .setTitle("An Error has occured!")
        .setColor(config.Colors.Failure)
        .setDescription("I think i might be coded wrongly!")).then(() => {
        throw error
    }));
}
module.exports.help = {
    name: "servers",
    description: `Shows all the Servers.`,
    usage: `servers`,
    category: `Panel`
}
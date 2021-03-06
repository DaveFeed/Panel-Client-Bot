const Discord = require('discord.js');
const config = require(`../config`);
const pteroclient = require(`../utils/client`);

module.exports.run = async (client, message, args) => {
    if (!global.pterologged) return message.channel.send(':x: | You are not logged in!')
    let msg = await message.channel.send(new Discord.MessageEmbed()
        .setTitle("Fetching Data...")
        .setColor(config.Colors.Waiting)
        .setDescription("This might take some time."))

    pteroclient.getServers(config.host,config.api_token).then(async servers => {
        let embed = new Discord.MessageEmbed()
            .setTitle("Your Servers")
            .setColor(config.Colors.Listing);
        for (let i = 0; i < servers.length; i++) {
            let server = servers[i].attributes;
            embed.addField(`${server.name} ${server.server_owner?"(Owner)":"(Member)"}`,
                `\`\`\`${server.is_installing?"INSTALLING\n":""}ID: ${server.identifier}\
                \n${server.node.replace(' ',": ")}\
                \nIP Adress: ${server.relationships.allocations.data[0].attributes.ip}\
                \nPort: ${server.relationships.allocations.data[0].attributes.port}\`\`\``
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
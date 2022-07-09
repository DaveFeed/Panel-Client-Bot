const Discord = require('discord.js');
const config = require(`../config`);
const pteroclient = require(`../utils/client`);

module.exports.run = async (client, message, args) => {
    if (!global.pterologged)
        return message.channel.send(':x: | You are not logged in!')
    if (!args[0])
        return message.channel.send(':x: | Please provide ServerID!')
    let msg = await message.channel.send(new Discord.MessageEmbed()
        .setTitle("Fetching Data...")
        .setColor(config.Colors.Waiting)
        .setDescription("This might take some time."))
    pteroclient.getServer(config.host, config.api_token, args[0])
        .then(async data => {
            let embed = new Discord.MessageEmbed()
            try{
                embed
                .setTitle(`Server: ${data.info.name}`)
                    .setColor(config.Colors.Success)
                    .setDescription(`\`${client.Upercase(data.resources.attributes.current_state)}\`!\
                \nRAM Used: \`${parseInt(data.resources.attributes.resources.memory_bytes/1024/1024*100)/100}Mb\`\
                \nCPU Used: \`${data.resources.attributes.resources.cpu_absolute}%\`\
                \nDisk Space: \`${parseInt(data.resources.attributes.resources.disk_bytes/1024/1024*100)/100}Mb\`\
                \nNetwork: \`${parseInt(data.resources.attributes.resources.network_rx_bytes/1024/1024*100)/100}Mb\``)
                    .setTimestamp();
            }
            catch(e){
                 embed
                     .setTitle(`Server: ${data.info.name}`)
                     .setColor(config.Colors.Failure)
                     .setDescription(`Server Node is down. Please try later`)
                     .setTimestamp();
            }
            await msg.edit(embed);
        }).catch(error => {
            msg.edit(new Discord.MessageEmbed()
                .setTitle("An Error has occured!")
                .setColor(config.Colors.Failure)
                .setDescription(`Please check logs for full info.\
                \nLog name: ${global.logname}.log`))
            client.log(error);
        });
}
module.exports.help = {
    name: "server",
    description: `Shows Server details.`,
    usage: `server [serverid]`,
    category: `Panel`
}
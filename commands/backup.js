const Discord = require('discord.js');
const config = require(`../config`);

module.exports.run = async (client, message, args) => {
    
};

module.exports.help = {
    name: "backup",
    description: `Manage your server backups.`,
    usage: `bakup [category]`,
    category: `Panel`
}


/*
pteroclient.getBackups(config.host, config.api_token, server.identifier)
    .then(async data => {
        if (data.length == 0) return msg.edit(new Discord.MessageEmbed()
            .setTitle(`Server: ${server.name}`)
            .setColor(config.Colors.Failure)
            .setDescription("No backups were found"))
        let embed = new Discord.MessageEmbed()
            .setTitle(`Server: ${server.name}`)
            .setColor(config.Colors.Success)
            .setDescription('You have 1 minute to type the command needed.\
                \nYou can:\
                \nCreate\
                \nDownload {uuid}\
                \nDelete {uuid}')
        data.forEach(backup => {
            console.log(backup.attributes.bytes)
            embed.addField(backup.attributes.name, backup.attributes.bytes == 0 ? "```This backup has failed, please delete```" : `\`\`\`UUID: ${backup.attributes.uuid}\
                    \nSize : ${parseInt(backup.attributes.bytes/1024/1024*100)/100}Mb\
                    \nCreated At : ${client.FormatDate(new Date(backup.attributes.created_at))}\
                    \nIgnored Files : ${backup.attributes.ignored_files.join(', ')}\n\`\`\``)
        });
        msg.edit(embed)
    }).catch(error => {
        message.channel.send(new Discord.MessageEmbed()
            .setTitle(`Server: ${server.name}`)
            .setColor(config.Colors.Failure)
            .setDescription(`Was Error while running command \`${choice.first().content}\``))
        client.log(error);
    });*/
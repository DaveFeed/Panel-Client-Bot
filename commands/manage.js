const Discord = require('discord.js');
const config = require(`../config`);
const pteroclient = require('../utils/client')

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
            let online = false;
            try {
                data.resources.attributes.current_state
                embed
                    .setTitle(`Server: ${data.info.name}`)
                    .setColor(config.Colors.Success)
                    .setDescription(`\`${client.Upercase(data.resources.attributes.current_state)}\`!\nChoose your action!\
                    \n:one: - Change Power Status.\
                    \n:two: - Send Command to Server.\
                    \n:three: - Download Backups.\
                    \n:four: - Open File explorer.`)
                    .setTimestamp();
                online = true;
            } catch (e) {
                online = false;
                embed
                    .setTitle(`Server: ${data.info.name}`)
                    .setColor(config.Colors.Failure)
                    .setDescription(`Server Node is down. Please try later`)
                    .setTimestamp();
            }
            await msg.edit(embed);
            if (online) {
                msg.react('1️⃣');
                msg.react('2️⃣');
                msg.react('3️⃣');
                msg.react('4️⃣');
                let choice = await getChoice(msg);
                msg.reactions.removeAll()
                switch (choice) {
                    case 1: {
                        msg.edit(new Discord.MessageEmbed()
                            .setTitle(`Server: ${data.info.name}`)
                            .setColor(config.Colors.Waiting)
                            .setDescription(`Choosen Action: \`Change Power Status\``))
                        await ChangeStatus(client, message, data.info, client.Upercase(data.resources.attributes.current_state))
                        break;
                    }
                    case 2: {
                        msg.edit(new Discord.MessageEmbed()
                            .setTitle(`Server: ${data.info.name}`)
                            .setColor(config.Colors.Waiting)
                            .setDescription(`Choosen Action: \`Send Command to Server\``))
                        await SendCommand(client, message, data.info, data.resources.attributes.current_state)
                        break;
                    }
                    case 3: {
                        msg.edit(new Discord.MessageEmbed()
                            .setTitle(`Server: ${data.info.name}`)
                            .setColor(config.Colors.Waiting)
                            .setDescription(`Choosen Action: \`Download Backup\``))
                        await DownloadBackup(client, message, data.info)
                        break;
                    }
                    case 4: {
                        msg.edit(new Discord.MessageEmbed()
                            .setTitle(`Server: ${data.info.name}`)
                            .setColor(config.Colors.Waiting)
                            .setDescription(`Choosen Action: \`Open File explorer\``))
                        await FileExplorer(client, message, args[0])
                        break;
                    }
                    default: {
                        msg.edit(new Discord.MessageEmbed()
                            .setTitle(`Server: ${data.info.name}`)
                            .setColor(config.Colors.Failure)
                            .setDescription(`No Action was choosed`))
                        break;
                    }
                }
            }
        }).catch(error => {
            message.channel.send(new Discord.MessageEmbed()
                .setTitle("An Error has occured!")
                .setColor(config.Colors.Failure)
                .setDescription(`Please check logs for full info.\
                \nLog name: ${global.logname}.log`))
            client.log(error);
        });
}
module.exports.help = {
    name: "manage",
    description: `Manages the server.`,
    usage: `manage [serverid]`,
    category: `Panel`
}


async function getChoice(m) {
    let temp = await m.awaitReactions((reaction, user) => ['1️⃣', '2️⃣', '3️⃣', '4️⃣'].includes(reaction.emoji.name) && !user.bot, {
        max: 1,
        time: (60 * 1000)
    })
    try {
        if (temp.first().emoji.name == '1️⃣') return 1;
        if (temp.first().emoji.name == '2️⃣') return 2;
        if (temp.first().emoji.name == '3️⃣') return 3;
        if (temp.first().emoji.name == '4️⃣') return 4;
    } catch (err) {
        return undefined;
    }
}
async function getBackupChoice(m, length) {
    let temp = await m.awaitReactions((reaction, user) => ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣', '🔟'].slice(0, length).includes(reaction.emoji.name) && !user.bot, {
        max: 1,
        time: (60 * 1000)
    })
    try {
        if (temp.first().emoji.name == '1️⃣') return 0;
        if (temp.first().emoji.name == '2️⃣') return 1;
        if (temp.first().emoji.name == '3️⃣') return 2;
        if (temp.first().emoji.name == '4️⃣') return 3;
        if (temp.first().emoji.name == '5️⃣') return 4;
        if (temp.first().emoji.name == '6️⃣') return 5;
        if (temp.first().emoji.name == '7️⃣') return 6;
        if (temp.first().emoji.name == '8️⃣') return 7;
        if (temp.first().emoji.name == '9️⃣') return 8;
        if (temp.first().emoji.name == '🔟') return 9;
    } catch (err) {
        return undefined;
    }
}
async function ChangeStatus(client, message, server, server_state) {
    let embed = new Discord.MessageEmbed()
        .setTitle(`Server: ${server.name}`)
        .setColor(config.Colors.Success)
        .setDescription(`Current Status: \`${server_state}\`!\
                \n:one: - Start\
                \n:two: - Restart\
                \n:three: - Stop\
                \n:four: - Kill`)
        .setFooter("You have 2 minutes to choose");
    let msg = await message.channel.send(embed);
    msg.react('1️⃣');
    msg.react('2️⃣');
    msg.react('3️⃣');
    msg.react('4️⃣');
    let choice = await getChoice(msg);
    msg.reactions.removeAll()
    if (!choice) return msg.edit(new Discord.MessageEmbed()
        .setTitle(`Server: ${server.name}`)
        .setColor(config.Colors.Failure)
        .setDescription(`No Action was choosed`))
    let state;
    switch (choice) {
        case 1:
            state = "start";
            break;
        case 2:
            state = "restart";
            break;
        case 3:
            state = "stop";
            break;
        case 4:
            state = "kill";
            break;
    }
    msg.edit(new Discord.MessageEmbed()
        .setTitle(`Server: ${server.name}`)
        .setColor(config.Colors.Waiting)
        .setDescription(`Chosen Action!\
                \n\`${client.Upercase(state)}\``)
        .setFooter("Please wait till its done!"))
    pteroclient.powerServer(config.host, config.api_token, server.identifier, state)
        .then(async success => {
            if (success == true) {
                message.channel.send(new Discord.MessageEmbed()
                    .setTitle(`Server: ${server.name}`)
                    .setColor(config.Colors.Success)
                    .setDescription(`Action \`${client.Upercase(state)}\` has been successfully ran!`))
            } else {
                message.channel.send(new Discord.MessageEmbed()
                    .setTitle(`Server: ${server.name}`)
                    .setColor(config.Colors.Failure)
                    .setDescription(`The server is in that state, or currently changing its state!`))
            }
        }).catch(error => {
            message.channel.send(new Discord.MessageEmbed()
                .setTitle(`Server: ${server.name}`)
                .setColor(config.Colors.Failure)
                .setDescription(`An Error has occured while running action \`${client.Upercase(state)}\``))
            client.log(error);
        });
}
async function SendCommand(client, message, server, server_state) {
    if (['offline', 'stopping'].includes(server_state.toLowerCase()))
        return message.channel.send(':x: | You cannot send commands to ofline servers')
    let embed = new Discord.MessageEmbed()
        .setTitle(`Server: ${server.name}`)
        .setColor(config.Colors.Success)
        .setDescription(`Write your command after this message!`)
        .setFooter("You have 1 minute to write");
    let msg = await message.channel.send(embed);
    let choice = await message.channel.awaitMessages(m => m.author.id === message.author.id, {
        max: 1,
        time: 60000
    });
    if (!choice || choice.first() == undefined) return msg.edit(new Discord.MessageEmbed()
        .setTitle(`Server: ${server.name}`)
        .setColor(config.Colors.Failure)
        .setDescription(`No Command was sent`))
    msg.edit(new Discord.MessageEmbed()
        .setTitle(`Server: ${server.name}`)
        .setColor(config.Colors.Waiting)
        .setDescription(`Sending command!\
                \n\`${choice.first().content}\``)
        .setFooter("Please wait till its done!"))
    pteroclient.sendCommand(config.host, config.api_token, server.identifier, choice.first().content)
        .then(async success => {
            if (success == true) {
                message.channel.send(new Discord.MessageEmbed()
                    .setTitle(`Server: ${server.name}`)
                    .setColor(config.Colors.Success)
                    .setDescription(`Command \`${choice.first().content}\` has been successfully ran!`))
            } else {
                message.channel.send(new Discord.MessageEmbed()
                    .setTitle(`Server: ${server.name}`)
                    .setColor(config.Colors.Failure)
                    .setDescription(`An Error has occured while running command \`${choice.first().content}\`!`))
            }
        }).catch(error => {
            message.channel.send(new Discord.MessageEmbed()
                .setTitle(`Server: ${server.name}`)
                .setColor(config.Colors.Failure)
                .setDescription(`Was Error while running command \`${choice.first().content}\``))
            client.log(error);
        });
}
async function DownloadBackup(client, message, server) {
    let msg = await message.channel.send(new Discord.MessageEmbed()
        .setTitle(`Server: ${server.name}`)
        .setColor(config.Colors.Waiting)
        .setDescription(`Getting backup data!`));
    let data = await pteroclient.getBackups(config.host, config.api_token, server.identifier)
    if (data.length == 0) return msg.edit(new Discord.MessageEmbed()
        .setTitle(`Server: ${server.name}`)
        .setColor(config.Colors.Failure)
        .setDescription("No backups were found"))
    let embed = new Discord.MessageEmbed()
        .setTitle(`Server: ${server.name}`)
        .setColor(config.Colors.Success)
        .setDescription('Press the corresponding emoji to download the data from it!')
    let i = 0;
    data.forEach(backup => {
        embed.addField(`${i} ${backup.attributes.name}`,
            backup.attributes.bytes == 0 ? "```This backup has failed, please delete```" : `\`\`\`UUID: ${backup.attributes.uuid}\
                    \nSize : ${parseInt(backup.attributes.bytes/1024/1024*100)/100}Mb\
                    \nCreated At : ${client.FormatDate(new Date(backup.attributes.created_at))}\
                    \nIgnored Files : ${backup.attributes.ignored_files.join(', ')}\n\`\`\``)
    });
    await msg.edit(embed)
    let emojies = ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣', '🔟']
    //I don't check here if the data is bigger than 10, because max on hosting is 10 :), if you want, add. Its on you!
    for (let i = 0; i < data.length; i++) {
        try {
            msg.react(emojies[i]);
        } catch (e) {}
    }
    let choice = await getBackupChoice(msg, data.length);
    msg.reactions.removeAll();
    if (choice === undefined) return msg.edit(new Discord.MessageEmbed()
        .setTitle(`Server: ${server.name}`)
        .setColor(config.Colors.Failure)
        .setDescription(`No Backup was choosed`))
    try {
        let link = await pteroclient.downloadBackup(config.host, config.api_token, server.identifier, data[choice].attributes.uuid);
        try {
            message.author.send(new Discord.MessageEmbed()
            .setTitle("Download Link!")
            .setColor(config.Colors.Success)
            .setDescription(`Here is the link for downloading the backup!\
            \n**Server Name** : ${server.name}\
            \n**Backup Name** : ${data[choice].attributes.name}\
            \n[Click Here](${link.url})`))
        } catch (err) {
            if (err.name == "DiscordAPIError")
                return message.channel.send(new Discord.MessageEmbed()
                    .setColor('#851600')
                    .setTitle("> У вас отключена возможность получения сообщений от участников сервера."))
            else throw err;
        }
    } catch (e) {
        message.channel.send(new Discord.MessageEmbed()
            .setTitle(`Server: ${server.name}`)
            .setColor(config.Colors.Failure)
            .setDescription(`Error occured while trying to get backup download link!`))
    }
}
async function FileExplorer(client, message, server) {
    try {
        await pteroclient.getFiles(config.host, config.api_token, server);
    } catch (e) {
        console.log(e);
    } //not so
}
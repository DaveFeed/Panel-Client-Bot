const Discord = require('discord.js');
const fs = require('fs')
const events = require('events');
const config = require(`../config`);
const pteroclient = require('../utils/client')
var monitorEvents = new events.EventEmitter();

module.exports.run = async (client, message, args) => {
    if (!args[0])
        return monitorEvents.emit("help", client, message);
    let temp = args[0].toLowerCase();
    if (monitorEvents.eventNames().includes(temp) && temp !== 'error')
        return monitorEvents.emit(temp, client, message, args.splice(1));
};

module.exports.help = {
    name: "monitor",
    usage: `monitor [category]`,
    category: `Panel`
}

monitorEvents.on('help', async (client, message, args) => {
    return message.channel.send(new Discord.MessageEmbed()
        .setTitle("Guide for Monitors")
        .setColor(config.Colors.Listing)
        .setDescription(
            `Monitor is a updater with all current server stats.\
    \nTo create a server monitor, use: "${config.prefix}monitor create {serverid}"\
    \nList all the monitors: "${config.prefix}monitor list"\
    \nEdit monitor: "${config.prefix}monitor edit {monitorname or serverid}"`))
});

monitorEvents.on('list', async (client, message, args) => {
    let monitors = require('../monitors.json');
    let channel = await message.guild.channels.resolve(monitors.ChannelID);
    let embed = new Discord.MessageEmbed()
        .setTitle("All current Monitors")
        .setColor(config.Colors.Listing)
        .setDescription(`Monitor channel: ${channel?`<#${channel.id}>`: "Unavailable"}`)
    for (let i = 0; i < monitors.list.length; i++) {
        let msg;
        try {
            msg = await channel.messages.fetch(monitors.list[i].messageid);
        } catch (err) {}
        embed.addField(`${i+1}.${monitors.list[i].serverid}`, `Message: ${msg?"`Available`":"`Couldn't reach`"}`)
    }
    embed.setFooter("More info comming soon ...")
    message.channel.send(embed);
})

monitorEvents.on('start', async (client, message, args) => {
    if (global.monitorInterval)
        return message.channel.send(`:x: | It is already started!`)
    global.monitorInterval = setInterval(
        () => {
            client.UpdateServers();
        },
        config.ServerUpdate * 1000
    )
    return message.channel.send(":white_check_mark: | Started all monitors!")
})

monitorEvents.on('stop', async (client, message, args) => {
    clearInterval(global.monitorInterval);
    global.monitorInterval = undefined;
    return message.channel.send(":white_check_mark: | Stopped all monitors!")
})

monitorEvents.on('add', async (client, message, args) => {
    if (!args[0])
        return message.channel.send(":x: | No server choosen!");
    args[0] = args[0].toLowerCase();
    let monitors = require('../monitors.json');
    if (!monitors.ChannelID)
        return message.channel.send(`:x: | There is no channel in config!`);
    if (monitors.list.map(obj => obj.serverid).includes(args[0]))
        return message.channel.send(":x: | Server monitor with this id already exists!")

    let m = await message.channel.send(new Discord.MessageEmbed()
        .setTitle("Adding new Monitor")
        .setColor(config.Colors.Waiting)
        .setDescription(`Checking server with id \`${args[0]}\``))

    try {
        let temp = await pteroclient.getServer(config.host, config.api_token, args[0]);
        if (!temp) throw new Error();
    } catch (e) {
        return m.edit(new Discord.MessageEmbed()
            .setTitle("An Error has occured!")
            .setColor(config.Colors.Failure)
            .setDescription(`Couldn't identify the server, please try again!`))
    }

    let channel = await message.guild.channels.resolve(monitors.ChannelID);
    if (!channel) return m.edit(new Discord.MessageEmbed()
        .setTitle("An Error has occured!")
        .setColor(config.Colors.Failure)
        .setDescription(`Couldn't fine the channel for monitors!`))
    let mes = await channel.send(
        new Discord.MessageEmbed()
        .setTitle("Reserved message for monitor")
        .setColor(config.Colors.Waiting)
        .setDescription(`ServerId: ${args[0]}\
        \nThis message will get updated after ${config.ServerUpdate} seconds!`))
    monitors.list.push({
        serverid: args[0],
        messageid: mes.id
    })
    fs.writeFile(`./monitors.json`, JSON.stringify(monitors, null, '\t'), (err) => {
        if (err) console.log(err)
    })
    m.edit(new Discord.MessageEmbed()
        .setTitle("Added new Monitor")
        .setColor(config.Colors.Success)
        .setDescription(`Successfully added new Monitor with serverid: \`${args[0]}\``))
})

monitorEvents.on('edit', async (client, message, args) => {
    if (!args[0])
        return message.channel.send(":x: | No server choosen!");
    args[0] = args[0].toLowerCase();
    let monitors = require('../monitors.json');
    if (!monitors.list.map(obj => obj.serverid).includes(args[0]))
        return message.channel.send(":x: | There is no monitor with that serverid!")
    let embed = new Discord.MessageEmbed()
        .setTitle(`Choose your action!`)
        .setColor(config.Colors.Waiting)
        .setDescription(
            `:one: - Change MessageId.\
           \n:two: - Change ServerId.`)
        .setTimestamp();

    let msg = await message.channel.send(embed);
    msg.react('1️⃣');
    msg.react('2️⃣');

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
        default: {
            msg.edit(new Discord.MessageEmbed()
                .setTitle(`No Action was choosed`)
                .setColor(config.Colors.Failure))
            break;
        }
    }
})

monitorEvents.on('delete', async (client, message, args) => {
    if (!args[0])
        return message.channel.send(":x: | No server choosen!");
    args[0] = args[0].toLowerCase();
    let monitors = require('../monitors.json');
    if (!monitors.list.map(obj => obj.serverid).includes(args[0]))
        return message.channel.send(":x: | There is no monitor with that serverid!")
    try {
        let monitor = monitors.list.find(obj => obj.serverid == args[0]);
        monitors.list = removeMonitor(monitors.list, args[0]);
        let channel = await message.guild.channels.resolve(monitors.ChannelID);
        let msg = await channel.messages.fetch(monitor.messageid);
        msg.delete();
    } catch (err) {}
    fs.writeFile(`./monitors.json`, JSON.stringify(monitors, null, '\t'), (err) => {
        if (err) console.log(err)
    })
    return message.channel.send(":white_check_mark: | Successfully deleted monitor!");
})

monitorEvents.on('error', (err) => {
    console.log(`Error in monitors.js:\n${err}`)
})

function removeMonitor(arr, value) {
    var i = 0;
    while (i < arr.length) {
        if (arr[i].serverid === value) {
            arr.splice(i, 1);
        } else {
            ++i;
        }
    }
    return arr;
}

async function getChoice(m) {
    let temp = await m.awaitReactions((reaction, user) => ['1️⃣', '2️⃣'].includes(reaction.emoji.name) && !user.bot, {
        max: 1,
        time: (60 * 1000)
    })
    try {
        if (temp.first().emoji.name == '1️⃣') return 1;
        if (temp.first().emoji.name == '2️⃣') return 2;
    } catch (err) {
        return undefined;
    }
}
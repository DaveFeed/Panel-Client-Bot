const Discord = require('discord.js');
const config = require(`../config`);
const speedTest = require('speedtest-net');

module.exports.run = async (client, message, args) => {
    try {
        const m = await message.channel.send(new Discord.MessageEmbed()
            .setTitle("Starting Testing!")
            .setDescription("Getting data ...")
            .setFooter("Please 10-30 seconds.")
            .setColor(config.Colors.Waiting));
        let testinfo = await speedTest({
            acceptLicense: true,
            acceptGdpr: true
        })
        m.edit(new Discord.MessageEmbed()
            .setTitle(`Here are the results!`)
            .setColor(config.Colors.Success)
            .addFields({
                name: `> Test Results:`,
                value: "```java\n" +
                    `Ping : ${Math.floor(testinfo.ping.latency)}ms\
              \nDownload : ${bytesToSize(testinfo.download.bandwidth * 8)}\
              \nUpload : ${bytesToSize(testinfo.upload.bandwidth * 8)}\
              \nTime Elapsed : ${((testinfo.download.elapsed+testinfo.upload.elapsed)/1000).toFixed(2)}s.\`\`\``,
            }, {
                name: `> Server:`,
                value: "```swift\n" +
                    `Name : ${testinfo.server.name}\
              \nLocation : ${testinfo.server.location}\
              \nCountry : ${testinfo.server.country}\
              \nIP : ${testinfo.server.ip}:${testinfo.server.port}\
              \n(${testinfo.server.host})\`\`\``
            })
            .setDescription(`To see results click [Here]( ${testinfo.result.url} ).`))
    } catch (e) {
        //ADD ERROR
    }
};

module.exports.help = {
    name: "internet",
    description: `Command for checking the internet speed.`,
    usage: `internet`,
    category: `Other`
}

function bytesToSize(bytes, decimals = 2) {
    if (bytes === 0) return '0 Bytes';
    const k = 1000;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KBps', 'MBps', 'GBps', 'TBps', 'PBps', 'EBps', 'ZBps', 'YB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}
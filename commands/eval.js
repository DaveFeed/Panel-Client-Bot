//const beautify = require('js-beautify').js;
const Discord = require('discord.js');
const config = require('../config')

module.exports.run = async (client, message, args) => {
    let code;
    try {
        if (args[0] === undefined) return message.channel.send(":x: | No Arguments")
        code = args.join(" ");
        let evaled = eval(code);
        if (typeof evaled !== "string") evaled = require("util").inspect(evaled);

        message.channel.send(
            new Discord.MessageEmbed()
            .setTitle("Run was compeated")
            .setColor('#0d7a07')
            .setDescription(`Code: \`\`\`javascript\n${client.clean(code)}\n\`\`\`\nReturned:\`\`\`javascript\n${client.clean(evaled)}\`\`\``));
    } catch (err) {
        message.channel.send(
            new Discord.MessageEmbed()
            .setTitle("An Error has occured!")
            .setColor('#8c1804')
            .setDescription(`Code: \`\`\`javascript\n${client.clean(code)}\n\`\`\`\nError:\`\`\`javascript\n${client.clean(err.name)}\`\`\``));
    }
};

module.exports.help = {
    name: "eval",
    description: `To Evaluate code.`,
    usage: `eval`,
    category: `Other`
}
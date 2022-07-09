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




exports.run = async (client, message, args) => {
    await fs.readdir('./commands/', async (err, files) => {
        try {
            console.log('Loading Commands: Starting ...');
            if (err) throw err;
            let i = 0;
            let jsfiles = files.filter(f => f.split(".").pop() === "js");
            if (jsfiles.length <= 0) console.log("No commands", chalk.gray);
            else console.log(`Spotted ${jsfiles.length} commands.`, chalk.gray);
            client.commands = new Discord.Collection();
            jsfiles.forEach((f) => {
                try {
                    delete require.cache[require.resolve(`../commands/${f}`)]
                    let props = require(`../commands/${f}`);
                    client.commands.set(props.help.name, props);
                    client.log(`${++i}.Loading '${f}'`, chalk.whiteBright);
                    count++;
                } catch (e) {
                    client.log(e);
                    client.log(`${++i}.Couldn't Load '${f}'`, chalk.redBright);
                }
            });
        } catch (error) {
            client.log(error);
        } finally {
            client.log('Loading Commands: Done ...', chalk.white, chalk.bgMagenta);
            if (message) message.channel.send(`:white_check_mark: | Loaded ${count} Server commands.`)
        }
    });
}
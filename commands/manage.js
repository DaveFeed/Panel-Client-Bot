const Discord = require('discord.js');
const config = require(`../config`);

module.exports.run = async (client, message, args) => {
    if (!global.pterologged)
        return message.channel.send(':x: | You are not logged in!')
    if (!args[0])
        return message.channel.send(':x: | Please provide ServerID!')
    let msg = await message.channel.send(new Discord.MessageEmbed()
        .setTitle("Fetching Data...")
        .setColor(config.Colors.Waiting)
        .setDescription("This might take some time."))
    global.pteroclient.getClientServer(args[0])
        .then(async server => {
            let embed = new Discord.MessageEmbed()
                .setTitle(`Server: ${server.name}`)
                .setColor(config.Colors.Success)
                .setDescription('Please choose your action!\
                \n:one: - Start\
                \n:two: - Restart\
                \n:three: - Stop\
                \n:four: - Kill')
                .setFooter("You have 2 minute to choose");
            await msg.edit(embed);
            msg.react('1️⃣');
            msg.react('2️⃣');
            msg.react('3️⃣');
            msg.react('4️⃣');
            let choice = await getChoice(msg);
            msg.reactions.removeAll()
            if (!choice) return msg.edit(new Discord.MessageEmbed()
                .setTitle(`Server: ${server.name}`)
                .setColor(config.Colors.Failure)
                .setDescription("You didn't chose any action!"))
            msg.edit(new Discord.MessageEmbed()
                .setTitle(`Server: ${server.name}`)
                .setColor(config.Colors.Waiting)
                .setDescription(`Chosen Action!\
                \n\`${choice}\``)
                .setFooter("Please wait till its done!"))
            server.powerAction(choice).then(() => {
                message.channel.send(new Discord.MessageEmbed()
                    .setTitle(`Server: ${server.name}`)
                    .setColor(config.Colors.Success)
                    .setDescription(`Action \`${choice}\` has been successfully ran!`))
            }).catch(oWo => {
                message.channel.send(new Discord.MessageEmbed()
                    .setTitle(`Server: ${server.name}`)
                    .setColor(config.Colors.Success)
                    .setDescription(`An Error has occured while running action \`${choice}\``))
            });

        }).catch(error => {
            msg.edit(new Discord.MessageEmbed()
                .setTitle("An Error has occured!")
                .setColor(config.Colors.Failure)
                .setDescription("Please check logs for full info"))
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
        time: (120 * 1000)
    })
    try {
        if (temp.first().emoji.name == '1️⃣') return 'start';
        if (temp.first().emoji.name == '2️⃣') return 'restart';
        if (temp.first().emoji.name == '3️⃣') return 'stop';
        if (temp.first().emoji.name == '4️⃣') return 'kill';
    } catch (err) {
        return undefined;
    }
}
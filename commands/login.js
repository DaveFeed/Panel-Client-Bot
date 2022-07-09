const Discord = require('discord.js');
const config = require(`../config`);

module.exports.run = async (client, message, args) => {
    let msg = await message.channel.send(new Discord.MessageEmbed()
        .setTitle("Trying to log in")
        .setDescription("This might take some time.")
        .setColor(config.Colors.Waiting)
        .addField("API_KEY", `${config.api_token.substr(0, 4) + "..." + config.api_token.substr(config.api_token.length - 4)}`)
        .addField("HOST", config.host)
    );
    try {
        const pteroclient = require(`../utils/client`);
        if (await pteroclient.login(config.host, config.api_token)) {
            global.pterologged = true;
        } else {
            global.pterologged = false;
        }
        client.user.setPresence({
            activity: {
                name: global.pterologged ? `Logged in` : `Couldn't Login`
            }
        })
        if (!global.pterologged) throw new Error();
        return msg.edit(new Discord.MessageEmbed()
            .setTitle("Success!")
            .setColor(config.Colors.Success)
            .setDescription("You are now Logged In!"));
    } catch (e) {}
    global.pterologged = false;
    msg.edit(new Discord.MessageEmbed()
        .setTitle("Failed!")
        .setColor(config.Colors.Failure)
        .setDescription("Failed to Login!"))

};

module.exports.help = {
    name: "login",
    description: `Login into panel.`,
    usage: `login`,
    category: `Panel`
}
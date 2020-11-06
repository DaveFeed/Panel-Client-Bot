const Discord = require('discord.js');
const config = require(`../config`);
const {
    Builder
} = require("pterodactyl.js");

module.exports.run = async (client, message, args) => {
    let api = config.api_token
    let host = config.host
    if (args[0]) api = args[0];
    if (args[0]) host = args[1];
    if (api.length == 0 || host.length == 0)
        return message.channel.send(":x: | Please provide valid credentials!")
    await message.delete()
    let msg = await message.channel.send(new Discord.MessageEmbed()
        .setTitle("Trying to log in")
        .setDescription("This might take some time.")
        .setColor(config.Colors.Waiting)
        .addField("API_KEY", `${api.substr(0, 4) + "..." + api.substr(api.length - 4)}`)
        .addField("HOST", host)
    );
    global.pteroclient = new Builder()
        .setURL(host)
        .setAPIKey(api)
        .asUser();
    global.pteroclient.testConnection()
        .then(e => {
            global.pterologged = true;
            msg.edit(new Discord.MessageEmbed()
                .setTitle("Success!")
                .setColor(config.Colors.Success)
                .setDescription("You are now Logged In!"));
        })
        .catch(e => {
            global.pterologged = false;
            msg.edit(new Discord.MessageEmbed()
                .setTitle("Failed!")
                .setColor(config.Colors.Failure)
                .setDescription("Failed to Login!"))
        });
};

module.exports.help = {
    name: "login",
    description: `Login into panel.`,
    usage: `login {API_KEY} {HOST}`,
    category: `Panel`
}
const Discord = require("discord.js");
const config = require("../config");

module.exports.run = async (client, message, args) => {
    var query = args.join(" ").trim();
    if (!query) {
        message.channel.send(':x: | No search term provided!')
    } else {
        let msg = await message.channel.send(new Discord.MessageEmbed()
        .setTitle("Searching ...")
        .setDescription(`Entered Term: ${query}.\nPlease wait while the search ends, this can take a while.`)
        .setColor(config.Colors.Waiting)
        .setFooter("Progress: [.:[1}.\"\\';]"))
        let info = await client.pup(`https://www.google.com/search?q=${encodeURIComponent(query)}`);
        let embed = new Discord.MessageEmbed()
            .setTitle("Google search Complete!")
            .setDescription(`Search Term: ${query}`)
            .attachFiles([{
                attachment: info.screenshot,
                name: 'screenshot.png'
            }, `./${info.path}`])
            .setImage(`attachment://${info.random}.png`)
            .setColor(config.Colors.Success)
            .setTimestamp();
            console.log(embed.files);
        msg.edit(embed);
    }
}

module.exports.help = {
    name: "google",
    description: `Googles a term and returns a screenshot.`,
    usage: `google {term}`,
    category: `Other`
}
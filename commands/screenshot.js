module.exports.run = async (client, message, args) => {
    var query = args.join(" ").trim();
    if (!query) {
        return message.channel.send(":x: | No domain provided")
    } else {
        await message.react('🆗');
        await message.channel.send(`Google search with term: ${query}`, {
            files: [{
                attachment: await client.pup((query.startsWith("http://") || query.startsWith("https://")) ? query : `http://${query}`),
                name: "screenshot.png"
            }]
        });
    }
}

module.exports.help = {
    name: "screenshot",
    description: `Screenshots a web page.`,
    usage: `screenshot {domain}`,
    category: `Other`
}

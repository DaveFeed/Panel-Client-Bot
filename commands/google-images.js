module.exports.run = async (client, message, args) => {
    var query = args.join(" ").trim();
    if (!query) {
        message.channel.send(':x: | No search term provided!')
    } else {
        await message.react('🆗');
        await message.channel.send(`\`\`\`Google Image search with term: ${query}\`\`\``, {
            files: [{
                attachment: await client.pup(`https://www.google.com/search?q=${encodeURIComponent(query)}&tbm=isch&safe=${(message.channel.nsfw) ? 'off' : 'on'}`),
                name: "screenshot.png"
            }]
        });
    }
}

module.exports.help = {
    name: "google-images",
    description: `Googles images with a term and returns a screenshot.`,
    usage: `google-images {term}`,
    category: `Other`
}
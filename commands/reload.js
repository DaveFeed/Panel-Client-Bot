module.exports.run = async (client, message, args) => {
    client.Load.commands(client, message);
};
module.exports.help = {
    name: "reload",
    description: `Reloads all the commands from files.`,
    usage: `reload`,
    category: `Other`
}
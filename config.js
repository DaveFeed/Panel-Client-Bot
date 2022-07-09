require('dotenv-flow').config();

module.exports = {
    token: process.env.TOKEN,
    ipinfo_token: process.env.IPINFO_TOKEN,
    api_token: process.env.API_KEY,
    host: process.env.HOST,
    generateInvites: false, 
    banOnJoin: true, //this is for me, you can turn it off
    prefix: '/',
    timezone: 'Europe/Moscow',
    allowedIDs: [
        "470991764308754433",
    ],
    Colors: {
        Success: 'GREEN',
        Failure: 'RED',
        Listing: 'YELLOW',
        Waiting: 'GREYPLE'
    },
    NodesChannelId: '774511964008480789',
    NodesMessageid: '774519906712027147',
    NodeUpdate: 20,
    ServerUpdate: 30,
};
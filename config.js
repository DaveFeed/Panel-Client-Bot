require('dotenv-flow').config();

module.exports = {
    token: process.env.TOKEN,
    api_token: process.env.API_KEY,
    host: process.env.HOST,
    generateInvites: false,
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
    }
};
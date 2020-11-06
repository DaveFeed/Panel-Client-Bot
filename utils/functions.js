const chalk = require('chalk');
const moment = require('moment-timezone');
const fs = require('fs');
const Discord = require('discord.js');
const config = require('../config');

module.exports = client => {
    client.clean = text => {
        if (typeof (text) === "string") {
            return text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
        } else {
            return text;
        }
    };
    client.log = function (text) {
        try {
            fs.appendFileSync(`./logs/${logname}.log`, text + "\n");
        } catch (e) {}
        for (let i = 1; i < arguments.length; i++) {
            text = arguments[i](text);
        }
        console.log(text);

    };
    client.FormatDate = date => {
        return moment(date).tz(config.timezone).format('DD.MM.YYYY, HH:mm:ss');
    };
    client.Load = {
        commands: async (client, message) => {
            let count = 0;
            await fs.readdir('./commands/', async (err, files) => {
                try {
                    client.log('Loading Commands: Starting ...', chalk.white, chalk.bgMagenta);
                    if (err) throw err;
                    let i = 0;
                    let jsfiles = files.filter(f => f.split(".").pop() === "js");
                    if (jsfiles.length <= 0) client.log("No commands", chalk.gray);
                    else client.log(`Spotted ${jsfiles.length} commands.`, chalk.gray);
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
        },
        events: async (client, message) => {
            let count = 0;
            await fs.readdir('./events/', async (err, files) => {
                try {
                    client.log('Loading Events: Starting ...', chalk.white, chalk.bgYellow);
                    if (err) throw err;
                    let i = 0;
                    let jsfiles = files.filter(f => f.split(".").pop() === "js");
                    if (jsfiles.length <= 0) client.log("No events", chalk.gray);
                    else client.log(`Spotted ${jsfiles.length} events.`, chalk.gray);
                    jsfiles.forEach((f) => {
                        try {
                            delete require.cache[require.resolve(`../events/${f}`)]
                            let evt = require(`../events/${f}`);
                            client.on(f.split(".")[0], evt.bind(null, client));
                            client.log(`${++i}.Loading '${f}'`, chalk.whiteBright);
                            count++;
                        } catch (e) {
                            client.log(`${++i}.Couldn't Load '${f}'`, chalk.redBright);
                        }
                    });
                } catch (error) {
                    client.log(error);
                } finally {
                    client.log('Loading Events: Done ...', chalk.white, chalk.bgYellow);
                    if (message) message.channel.send(`:white_check_mark: | Loaded ${count} events.`)
                }
            });
        },
    }
    process.on("SIGINT", function close() {
        let totalSeconds = (client.uptime / 1000);
        client.log(`[Date: ${client.FormatDate(Date.now())}] [Worked for: ${Math.floor(totalSeconds / 86400)}d, ${Math.floor(totalSeconds / 3600)}h, ${Math.floor((totalSeconds % 3600) / 60)}m, ${Math.floor((totalSeconds % 3600) % 60)}s.]`, chalk.gray);
        process.exit();
    });
};
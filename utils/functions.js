const chalk = require('chalk');
const moment = require('moment-timezone');
const fs = require('fs');
const Discord = require('discord.js');
const config = require('../config');
const fetch = require('node-fetch');
const pupit = require('puppeteer');
module.exports = client => {
    SetLogger();
    Login();

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

    client.calculateTime = sec => {
        let hours = Math.floor(sec / 3600);
        let minutes = Math.floor((sec - (hours * 3600)) / 60);
        let seconds = sec - (hours * 3600) - (minutes * 60);
        let output = "";
        if (hours != 0) output += `${hours}h , `
        if (minutes != 0) output += `${minutes}m, `
        if (seconds != 0) output += `${seconds}s. `
        else output = output.slice(0, -2) + ".";
        return output;
    }

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
    //process.on('unhandledRejection', () => {})
    
    client.Upercase = (text) => `${text[0].toUpperCase()}${text.slice(1)}`

    client.pup = async (url) => {
        let page;
        if (!fs.existsSync("screenshots")) {
            fs.mkdirSync("screenshots");
        }
        try {
            const browser = await pupit.launch();
            page = await browser.newPage();
            await page.setViewport({
                width: 1920,
                height: 1080
            });
            await page.goto(url,{
                timeout:0
            });
            let random = randstring(8);
            let path = `screenshots/${random}.png`;
            let screenshot = await page.screenshot({
                type: 'png',
                path: path
            });
            await page.close()
            return {path:path,screenshot:screenshot,random:random};
        } catch (error) {
            page.close()
            throw error;
        } finally {
            try {
                page.close()
            } catch (error) {
                throw error;
            }
        }
    }

    client.UpdateServers = async () => {
        const monitors = require('../monitors.json');
        let channel = await client.channels.fetch(monitors.ChannelID);
        if (!channel) return;
        if (!global.pterologged) {
            for (let i = 0; i < monitors.list.length; i++) {
                try {
                    let message = await channel.messages.fetch(monitors.list[i].messageid);
                    message.edit(" ",new Discord.MessageEmbed()
                        .setTitle("Not Logged in!")
                        .setColor(config.Colors.Waiting)
                        .setDescription(`Please use command ${config.prefix}login for more details!`)
                        .setTimestamp())
                } catch (e) {}
            };
            return;
        }
        for (let i = 0; i < monitors.list.length; i++) {
            let server = monitors.list[i];
            let message = await channel.messages.fetch(server.messageid);
            if (!message) continue;
            try {
                let data = await require('./client').getServer(config.host, config.api_token, server.serverid).catch(o_O=>{ });
                if(!data) continue;
                let embed = new Discord.MessageEmbed().setTitle(`Server: ${data.info.name}`)
                    .setColor(data.resources.attributes && data.resources.attributes.current_state !== 'running' ? config.Colors.Waiting : config.Colors.Success)
                    .setDescription(`\`${client.Upercase(data.resources.attributes?data.resources.attributes.current_state:'No Data')}\`!`)
                    .addField(`Information`, `\`\`\`${data.info.is_installing?"INSTALLING\n":""}ID: ${data.info.identifier}\
                \n${data.info.node.replace(' '," : ")}\
                \nIP Adress : ${data.info.relationships.allocations.data[0].attributes.ip}\
                \nPort : ${data.info.relationships.allocations.data[0].attributes.port}\`\`\``)
                    .setTimestamp();
                try {
                    embed.addField('Resources', `\`\`\`RAM Used : ${parseInt(data.resources.attributes.resources.memory_bytes/1024/1024*100)/100}Mb\
                \nCPU Used : ${data.resources.attributes.resources.cpu_absolute}%\
                \nDisk Space : ${parseInt(data.resources.attributes.resources.disk_bytes/1024/1024*100)/100}Mb\
                \nNetwork : ${parseInt(data.resources.attributes.resources.network_rx_bytes/1024/1024*100)/100}Mb\`\`\``)
                } catch (e) {
                    embed.setColor(config.Colors.Failure);
                }
                message.edit(embed)
            } catch (e) {
                continue;
            }
        }
    }
};

function randstring(length) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) 
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    return result;
}

function SetLogger() {
    global.logname = moment(new Date()).tz(config.timezone).format('DD-MM-YYYY__HH-mm-ss');
    const fs = require('fs');
    if (!fs.existsSync('./logs'))
        fs.mkdirSync('./logs');
    fs.writeFileSync(`./logs/${logname}.log`, "", (err) => {
        if (err) client.log(err);
    });
}

async function Login(client) {
    const pteroclient = require(`./client`);
    let data = await pteroclient.login(config.host, config.api_token)
    if (data === true) {
        global.pterologged = true;
        console.log("Logged in PteroClient");
    } else if(typeof(data) === 'string'){
        global.pterologged = false;
        console.log(data);
    }
    else {
        global.pterologged = false;
        console.log("Couldn't login to Pteroclient");
    }
    try {
        client.user.setPresence({
            activity: {
                name: global.pterologged ? `Logged in` : `Couldn't Login`
            }
        })
    } catch (e) {}
}
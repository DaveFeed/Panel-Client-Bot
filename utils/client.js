const fetch = require('node-fetch');

module.exports = {
    login: async (HOST, API) => {
        HOST = HOST.trim();
        if (HOST.endsWith('/')) HOST = HOST.slice(0, -1);
        try {
            let response = await fetch(HOST + "/api/client", {
                "method": "GET",
                "headers": {
                    "Accept": 'application/json',
                    "Authorization": `Bearer ${API}`
                }
            })
            if (response.status === 503)
                return 'Service Temporarily Unavailable';
            if (response.status === 200)
                return true;
            return false;
        } catch (e) {
            return false;
        }
    },
    getServers: async (HOST, API) => {
        HOST = HOST.trim();
        if (HOST.endsWith('/')) HOST = HOST.slice(0, -1);

        let response = await fetch(HOST + "/api/client", {
            "method": "GET",
            "headers": {
                "Accept": 'application/json',
                "Authorization": `Bearer ${API}`
            }
        })
        let resp = await response.json();
        return resp.data;
    },
    getAccount: async (HOST, API) => {
        HOST = HOST.trim();
        if (HOST.endsWith('/')) HOST = HOST.slice(0, -1);

        let response = await fetch(HOST + "/api/client/account", {
            "method": "GET",
            "headers": {
                "Accept": 'application/json',
                "Content-Type": "application/json",
                "Authorization": `Bearer ${API}`
            }
        })
        let resp = await response.json();
        return resp.attributes;
    },
    getServer: async (HOST, API, ServerID) => {
        HOST = HOST.trim();
        if (HOST.endsWith('/')) HOST = HOST.slice(0, -1);

        let serverinfo = await fetch(HOST + "/api/client/servers/" + ServerID, {
            "method": "GET",
            "headers": {
                "Accept": "application/json",
                "Content-Type": "application/json",
                "Authorization": `Bearer ${API}`
            }
        })
        let resources = await fetch(HOST + `/api/client/servers/${ServerID}/resources`, {
            "method": "GET",
            "headers": {
                "Accept": "application/json",
                "Content-Type": "application/json",
                "Authorization": `Bearer ${API}`
            }
        })
        serverinfo = await serverinfo.json();
        resources = await resources.json();
        return {
            resources: resources,
            info: serverinfo.attributes
        };
    },
    sendCommand: async (HOST, API, ServerID, command) => {
        HOST = HOST.trim();
        if (HOST.endsWith('/')) HOST = HOST.slice(0, -1);

        let response = await fetch(HOST + `/api/client/servers/${ServerID}/command`, {
            "method": "POST",
            "headers": {
                "Accept": 'application/json',
                "Content-Type": "application/json",
                "Authorization": `Bearer ${API}`
            },
            "body": JSON.stringify({
                command: command
            })
        })
        if (response.status && response.status > 300)
            return false;
        return true;
    },
    powerServer: async (HOST, API, ServerID, signal) => {
        HOST = HOST.trim();
        if (HOST.endsWith('/')) HOST = HOST.slice(0, -1);
        //start	Starts the server
        //stop Gracefully stops the server
        //restart Stops then starts the server
        //kill Instantly end the server process
        let response = await fetch(HOST + `/api/client/servers/${ServerID}/power`, {
            method: "POST",
            headers: {
                'Content-Type': "application/json",
                Authorization: `Bearer ${API}`
            },
            body: JSON.stringify({
                signal: signal
            })
        })
        if (response.status && response.status > 300)
            return false;
        return true;
    },
    getServerFiles: async (HOST, API, ServerID, path) => {
        HOST = HOST.trim();
        if (HOST.endsWith('/')) HOST = HOST.slice(0, -1);
        if (path) path = `?directory=%2${path.trim()}`
        let response = await fetch(HOST + `/api/client/servers/${ServerID}/files/list${path}`, {
            "method": "POST",
            "headers": {
                "Accept": 'application/json',
                "Content-Type": "application/json",
                "Authorization": `Bearer ${API}`
            },
            "body": {
                "signal": signal
            }
        })
        return response;
    },
    getBackups: async (HOST, API, ServerID) => {
        HOST = HOST.trim();
        if (HOST.endsWith('/')) HOST = HOST.slice(0, -1);

        let response = await fetch(HOST + `/api/client/servers/${ServerID}/backups`, {
            "method": "GET",
            "headers": {
                "Accept": "application/json",
                "Content-Type": "application/json",
                "Authorization": `Bearer ${API}`
            }
        })
        response = await response.json();
        return response.data;
    },
    downloadBackup: async (HOST, API, ServerID, uuid) => {
        HOST = HOST.trim();
        if (HOST.endsWith('/')) HOST = HOST.slice(0, -1);

        let response = await fetch(HOST + `/api/client/servers/${ServerID}/backups/${uuid}/download`, {
            "method": "GET",
            "headers": {
                "Accept": "application/json",
                "Content-Type": "application/json",
                "Authorization": `Bearer ${API}`
            }
        })
        response = await response.json();
        return response.attributes;
    },
    getFiles: async (HOST, API, ServerID) => {
        HOST = HOST.trim();
        if (HOST.endsWith('/')) HOST = HOST.slice(0, -1);
        //imma check the api
        let response = await fetch(`${HOST}/api/client/servers/${ServerID}/files/list?directory=%2Fcache`, {
            "method": "GET",
            "headers": {
                "Accept": "application/json",
                "Content-Type": "application/json",
                "Authorization": `Bearer ${API}`,
            }
        })
        response = await response.json();
        console.log(response);
        return response;
    }
    //contents
    //download
    //rename
    //delete
    //allocations
}
const express = require('express');
const SocketServer = require('ws').Server;
const uuidv4 = require('uuid/v4')

// Set the port to 3001
const PORT = 3001;

// Create a new express server
const server = express()
    // Make the express server serve static assets (html, javascript, css) from the /public folder
    .use(express.static('public'))
    .listen(PORT, '0.0.0.0', 'localhost', () => console.log(`Listening on ${PORT}`));

// Create the WebSockets server
const wss = new SocketServer({ server });

const clientList = {}



//return a color
const getColor = () => {
    const colors = ['#e6194b', '#3cb44b', '#ffe119',
        '#4363d8', '#f58231', '#911eb4', '#46f0f0', '#f032e6',
        '#bcf60c', '#fabebe', '#008080', '#e6beff', '#9a6324',
        '#fffac8', '#800000', '#aaffc3', '#808000', '#ffd8b1',
        '#000075', '#808080']

    const index = Math.floor(Math.random() * 19)

    return colors[index]
}

const sendClientInfo = (client, clientInfo) => {

    const clientInfoToSend = {
        ...clientInfo,
        numOfClients: Object.keys(clientList).length,
        type: 'incomingClientInfo'
    }
    client.send(JSON.stringify(clientInfoToSend))
}

const connectClient = (client, clienNb) => {
    // generate an id for specific client
    const clientId = uuidv4()

    client.id = clientId

    clientList[clientId] = {
        id: clientId,
        name: `Anonymous${clienNb}`,
        color: getColor()
    }
    console.log(`Client id: ${clientId} connected`)
    sendClientInfo(client, clientList[clientId])
}

wss.broadcast = function broadcast(data) {
    wss.clients.forEach(function each(client) {
        client.send(data);
    });
};


// Set up a callback that will run when a client connects to the server
// When a client connects they are assigned a socket, represented by
// the ws parameter in the callback.
wss.on('connection', (ws) => {

    connectClient(ws, wss.clients.size)
    ws.on('message', msg => {


        const clientMessage = JSON.parse(msg)
        let serverMessage
        switch (clientMessage.type) {
            case 'PostNotification':

                serverMessage = {
                    id: uuidv4(),
                    type: 'incomingNotification',
                    content: clientMessage.content,
                    username: clientMessage.username
                }

                wss.broadcast(JSON.stringify(serverMessage), ws)

                break;
            case 'postMessage':
                serverMessage = {
                    id: uuidv4(),
                    type: 'incomingMessage',
                    content: clientMessage.content,
                    username: clientMessage.username,
                    color: clientMessage.color
                }
                wss.broadcast(JSON.stringify(serverMessage), ws)
                break;

            default:
                console.log("Unknown Type of Message from Client")
        }
    })

    // Set up a callback for when a client closes the socket. This usually means they closed their browser.
    ws.on('close', () => {
        delete clientList[ws.id]
        console.log('Client disconnected')
    })

});
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
    const colors = ['#FF6633', '#FFB399', '#FF33FF', '#FFFF99', '#00B3E6',
        '#E6B333', '#3366E6', '#999966', '#99FF99', '#B34D4D',
        '#80B300', '#809900', '#E6B3B3', '#6680B3', '#66991A',
        '#FF99E6', '#CCFF1A', '#FF1A66', '#E6331A', '#33FFCC',
        '#66994D', '#B366CC', '#4D8000', '#B33300', '#CC80CC',
        '#66664D', '#991AFF', '#E666FF', '#4DB3FF', '#1AB399',
        '#E666B3', '#33991A', '#CC9999', '#B3B31A', '#00E680',
        '#4D8066', '#809980', '#E6FF80', '#1AFF33', '#999933',
        '#FF3380', '#CCCC00', '#66E64D', '#4D80CC', '#9900B3',
        '#E64D66', '#4DB380', '#FF4D4D', '#99E6E6', '#6666FF']

    const index = Math.floor(Math.random() * 49)

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

wss.broadcast = function broadcast(data, ws) {

    wss.clients.forEach(function each(client) {
        if (client !== ws) {
            client.send(data);
        }
    });
};


// Set up a callback that will run when a client connects to the server
// When a client connects they are assigned a socket, represented by
// the ws parameter in the callback.
wss.on('connection', (ws) => {

    connectClient(ws, wss.clients.size)
    console.log(clientList)

    ws.on('message', msg => {


        const clientMessage = JSON.parse(msg)
        let serverMessage
        switch (clientMessage.type) {
            case 'PostNotification':

                serverMessage = {
                    id: uuidv4(),
                    type: 'incomingNotification',
                    content: clientMessage.content,
                }

                wss.broadcast(JSON.stringify(serverMessage), ws)

                break;
            case 'postMessage':

                serverMessage = {
                    id: uuidv4(),
                    type: 'incomingMessage',
                    content: clientMessage.content,
                    username: clientMessage.username
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
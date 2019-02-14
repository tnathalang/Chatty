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
    console.log("Connected to Server")


    ws.on('message', msg => {
        console.log('TCL: msg', msg)

        const clientMessage = JSON.parse(msg)
        let serverMessage
        switch (clientMessage.type) {
            case 'PostNotification':

                serverMessage = {
                    id: uuidv4(),
                    type: 'incomingNotification',
                    content: clientMessage.content,
                }
                console.log(serverMessage)
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
    ws.on('close', () => console.log('Client disconnected'));
});
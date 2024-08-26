import { createServer }  from 'http';
import staticHandler from 'serve-handler';
import ws, { WebSocketServer } from 'ws';

// Create an HTTP server and forward every request to a special handler
const server = createServer((req, res) => {
    return staticHandler(req, res, { public: 'public' })
});

// Create a new instance of the WebSocket server, and we attach it to our existing HTTP server
const wss = new WebSocketServer({ server })
wss.on('connection', (client) => {
    console.log('Client connected !')
    client.on('message', (msg) => {    
        console.log(`Message:${msg}`);
        broadcast(msg)
    })
})

// broadcast() function is a simple iteration over all the known clients, where the send() function is invoked on each connected client.
function broadcast(msg) {
    for (const client of wss.clients) {
        if (client.readyState === ws.OPEN) {
            client.send(msg)
        }
    }
}

server.listen(process.argv[2] || 8080, () => {
    console.log(`server listening...`);
})
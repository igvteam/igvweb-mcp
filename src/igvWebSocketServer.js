import {WebSocket, WebSocketServer} from 'ws'



export default class IGVWebSocketServer {

    constructor({host = 'localhost', port = 60141, path = '/'}) {

        this.wss = new WebSocketServer({host, port, path})

        this.wss.on('connection', (ws) => {

            // If more than one client is connected, reject the new one.
            if (this.wss.clients.size > 1) {
                console.warn('Connection rejected: A client is already connected.')
                ws.send('Connection rejected: A client is already connected.')
                ws.terminate()
                return
            }

            console.warn('Client connected')

            ws.on('close', () => {
                console.warn('Client disconnected. Total clients:', this.wss.clients.size)
            })

            ws.send('Server: connection established')
        })
    }

    send(message) {

        message.uniqueID = generateUniqueID()

        return new Promise((resolve, reject) => {

            if (this.wss.clients.size === 0) {
                resolve({
                    message:"No client connection.  Is IGV-Web running?",
                    status: 'error'})
                return
            }

            // There should be at most 1 client
            const client = this.wss.clients.values().next().value

            if (client.readyState !== WebSocket.OPEN) {
                resolve({
                    message:"Client connection is not open.  Is IGV-Web running?",
                    status: 'error'})
                return
            }


            const messageListener = (data) => {
                try {
                    console.error(`Received response from IGV ${data}`)
                    const response = JSON.parse(data)
                    if (response.uniqueID === message.uniqueID) {
                        cleanup()
                        console.error(`Resolving ${response}`)
                        resolve(response)
                    }
                } catch (e) {
                    console.error("Error parsing JSON response from client", e)
                    // Optional: reject on parse error, or just wait for a valid message
                }
            }

            const timeout = setTimeout(() => {
                cleanup()
                console.error(`Timeout: No response for message id ${messageId}`)
                resolve({
                    message: `Timeout: No response for message id ${messageId}`,
                    status: 'error'
                })
            }, 10000) // 10-second timeout

            const cleanup = () => {
                clearTimeout(timeout)
                client.off('message', messageListener)
            }

            client.on('message', messageListener)

            try {
                client.send(JSON.stringify(message))
            } catch (e) {
                console.error(`Error ${e}`)
                cleanup()
                resolve({
                    message: `Error sending message ${e}`,
                    status: 'error'
                })
            }
        })
    }
}


function generateUniqueID() {
    const timestamp = Date.now().toString(36)
    const randomPart = Math.random().toString(36).substring(2)
    return `${timestamp}${randomPart}`
}

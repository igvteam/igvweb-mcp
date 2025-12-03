#!/usr/bin/env node

/**
 * IGV MCP Server
 *
 * A Model Context Protocol server for controlling IGV (Integrative Genomics Viewer) via socket commands.
 */

import IGVWebSocketServer from "./igvWebSocketServer.js"
import startMCPServer from "./mcpServer.js"


/**
 * Main server setup
 */
async function main() {

    // Parse command line arguments
    const args = process.argv.slice(2)
    let host = "localhost"
    let port = 60141

    for (let i = 0; i < args.length; i++) {
        if (args[i] === "--host" && i + 1 < args.length) host = args[i + 1]
        else if (args[i] === "--port" && i + 1 < args.length) port = parseInt(args[i + 1], 10)
    }

    // Initialize IGV connection
    const webSocketServer = new IGVWebSocketServer({host, port})
    await startMCPServer(webSocketServer)

}

main().catch((error) => {
    console.error("Fatal error:", error)
    process.exit(1)
})

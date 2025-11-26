#!/usr/bin/env node

/**
 * IGV MCP Server
 *
 * A Model Context Protocol server for controlling IGV (Integrative Genomics Viewer) via socket commands.
 */

import IGVConnection from "./webclientServer.js"
import startMCPServer from "./mcpServer.js"

/**
 * Parse host:port from arguments
 * @param {string} hostArg
 * @returns {{ host: string, port: number }}
 */
function parseHostPort(hostArg) {
    if (hostArg.includes(":")) {
        const [host, portStr] = hostArg.split(":")
        return {host, port: parseInt(portStr, 10)}
    }
    return {host: hostArg, port: 60141}
}

/**
 * Main server setup
 */
async function main() {

    // Parse command line arguments
    const args = process.argv.slice(2)
    let hostArg = "localhost:60141"

    for (let i = 0; i < args.length; i++)
        if (args[i] === "--host" && i + 1 < args.length) hostArg = args[i + 1]

    // Initialize IGV connection
    const {host, port} = parseHostPort(hostArg)
    const igvConnection = new IGVConnection({host, port})
    await startMCPServer(igvConnection)

}

main().catch((error) => {
    console.error("Fatal error:", error)
    process.exit(1)
})

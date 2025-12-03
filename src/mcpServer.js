/**
 * IGV MCP Server
 *
 * A Model Context Protocol server for controlling IGV (Integrative Genomics Viewer) via socket commands.
 */

import {Server} from "@modelcontextprotocol/sdk/server/index.js"
import {StdioServerTransport} from "@modelcontextprotocol/sdk/server/stdio.js"
import {CallToolRequestSchema, ListToolsRequestSchema} from "@modelcontextprotocol/sdk/types.js"
import parseTools from "./parseTools.js"

/**
 * Main server setup
 */
async function startMCPServer(webSocketServer) {

    const tools = await parseTools()
    console.error(`Loaded ${tools.length} tools from YAML configuration`)

    // Create MCP server
    const server = new Server(
        {name: "igvweb-mcp", version: "1.0.0"},
        {capabilities: {tools: {}}}
    )

    // Register tool list handler
    server.setRequestHandler(ListToolsRequestSchema, async () => {
        return {tools}
    })

    // Register tool call handler
    server.setRequestHandler(CallToolRequestSchema, async (request) => {
        const {name, arguments: args} = request.params

        try {
            // Find the tool specification by name
            const toolSpec = tools.find((t) => t.name === name)

            // If tool specification is not found, return an error
            if (!toolSpec) {
                throw new Error(`Tool '${name}' not found`)
            }

            const command = buildMessage(toolSpec._toolSpec, args)
            const result = await webSocketServer.send(command)

            return {
                content:
                    [
                        {type: "text", text: result.message}
                    ],
                isError: 'error' === result.status
            }


        } catch (error) {
            const errorMessage =
                error instanceof Error ? error.message : String(error)
            return {
                content: [
                    {type: "text", text: `Error executing tool '${name}': ${errorMessage}`}
                ],
                isError: true
            }
        }
    })

    // Start server with stdio transport
    const transport = new StdioServerTransport()
    await server.connect(transport)

    console.error("IGVWEB MCP Server running on stdio")
}


/**
 * Build IGV command message from tool specification and arguments
 * @param {object} toolSpec - The tool specification from YAML
 * @param {object} args - The arguments passed to the tool
 * @returns {string} The IGV command string
 */
function buildMessage(toolSpec, args) {

    const message = {type: toolSpec.name, args: {}}

    if (toolSpec.arguments) {
        for (const argSpec of toolSpec.arguments) {

            const argName = argSpec.name
            const argValue = args[argName]

            // Skip optional arguments that weren't provided
            if (argValue === undefined || argValue === null) continue

            // Handle special cases for boolean enum values (True/False)
            if (argSpec.enumValues) {
                const enumValue = String(argValue)
                // Convert "True"/"False" to lowercase for IGV
                if (enumValue === "True" || enumValue === "False") {
                    parts.push(enumValue.toLowerCase())
                }
                message.args[argName] = enumValue
            } else {
                // Regular argument value
                message.args[argName] = String(argValue)
            }
        }
    }

    return message
}


export default startMCPServer
// javascript
import {TabServerTransport} from "./@mcp-b/transports/dist/index.js"
import {McpServer} from "./@modelcontextprotocol/sdk/dist/esm/server/mcp.js"
import {z} from "./zod/index.js"
import {parse} from "../node_modules/yaml/browser/index.js"
import toolsYAML from "./tools.yaml.js"
import makeActionHandler from "./actionHandler.js"

export default async function startMCPServer(browser) {
    const server = new McpServer({name: "igv-webapp", version: "1.0.0"})

    const spec = parse(toolsYAML)
    const tools = Array.isArray(spec) ? spec : spec?.tools ?? []


    tools.forEach((tool) => {
        const handler = makeActionHandler(tool.name, browser)
        if (handler) {
            const config = {
                description: tool.description,
            }

            if (tool.arguments && Array.isArray(tool.arguments) && tool.arguments.length > 0) {
                const zodArgs = {}
                for (const a of tool.arguments) {
                    let schema
                    switch (a.type) {
                        case "integer":
                            schema = z.number().int().describe(a.description)
                            break
                        case "boolean":
                            schema = z
                                .preprocess((val) => String(val).toLowerCase() === "true", z.boolean())
                                .describe(a.description)
                            break
                        case "string":
                        default:
                            if (a.enumValues) {
                                const enumValues = a.enumValues.map((e) => e.value)
                                schema = z.enum(enumValues).describe(a.description)
                            } else {
                                schema = z.string().describe(a.description)
                            }
                            break
                    }

                    if (a.optional) {
                        zodArgs[a.name] = schema.optional()
                    } else {
                        zodArgs[a.name] = schema
                    }
                }
                config.inputSchema = zodArgs
            }
            server.registerTool(tool.name, config, handler)
        }
    })

    await server.connect(
        new TabServerTransport({
            allowedOrigins: ["*"],
        })
    )

    window.addEventListener("beforeunload", () => {
        server.close()
    })
}
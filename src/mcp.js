import {TabServerTransport} from "@mcp-b/transports"
import {McpServer} from "@modelcontextprotocol/sdk/server/mcp.js"
import {z} from "zod"
import {parse} from "yaml"
import toolsYAML from "./tools.yaml.js"
import makeActionHandler from "./actionHandler.js"

export default async function startMCPServer(browser) {
    const server = new McpServer({name: "igv-webapp", version: "0.0.1"})

    const spec = parse(toolsYAML)
    const tools = Array.isArray(spec) ? spec : spec?.tools ?? []

    const toolsetInfo = spec.toolset ?? {
        id: server.name,
        description: `This toolset provides access to the igv-webapp genome browser functionalities.
          A public instance of igv-webapp is available at https://igv.org/app-test., but igv-webapp can also be 
          self-hosted and customized.`,
    }

    // handler that returns the toolset metadata as a content item
    const toolsetHandler = async () => {
        return {
            content: [{
                type: "application/vnd.igv.toolset+json",
                data: toolsetInfo,
            }],
        }
    }

    // register a small read-only tool clients can query to learn the toolset identity
    server.registerTool(`${server.name}.toolset`, {
        description: "Return metadata for the igv-webapp toolset",
        inputSchema: {},
    }, toolsetHandler)


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
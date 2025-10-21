import {TabServerTransport} from "./@mcp-b/transports/dist/index.js"
import {McpServer} from "./@modelcontextprotocol/sdk/dist/esm/server/mcp.js"
import {z} from "./zod/index.js"


export default async function startMCPServer(browser) {

    // Create the server (one per site)
    const server = new McpServer({
        name: "igv-webapp",
        version: "1.0.0",
    })

    server.tool(
        "loadTrack",
        `Load a track into IGV
Usage:
  - url: the track URL to load (http(s) or gs protocol)
  - indexURL: optional index file URL, if required (for indexed formats)

Notes:
    - Supported formats include BAM, CRAM, VCF, BED, BEDPW, SEG, BEDGRAPH, WIG, BigWig, BigBed, GTF, and more.
    - Supported protocols are http(s) and gs.   
    - Note: ftp protocol is not supported.
    - A good resource for finding tracks is the trackhubs in https://github.com/igvteam/igv-data/tree/main/genomes/hubs.   
      Another source of trackhubs is the UCSC Genome Browser public hubs list: https://genome.ucsc.edu/cgi-bin/hgHubConnect.
`,
        {
            url: z.string().describe("The track URL to load"),
            indexURL: z.string().optional().describe("An index file URL, if required")
        },
        async ({url, indexURL}) => {
            // Your existing app logic here
            await browser.loadTrack({url, indexURL})

            return {
                content: [{
                    type: "text",
                    text: `Loaded ${url} `,
                }],
            }
        }
    )

    server.tool(
        "search",
        "Go to a specific locus",
        {
            locus: z.string().describe("The locus to go to (e.g., 'chr1:100-200', 'BRCA1')"),
        },
        async ({locus}) => {
            await browser.search(locus)
            return {
                content: [{
                    type: "text",
                    text: `Navigated to ${locus}`,
                }],
            }
        }
    )

    server.tool(
        "zoomIn",
        "Zoom in",
        {},
        async () => {
            await browser.zoomIn()
            return {
                content: [{
                    type: "text",
                    text: "Zoomed in",
                }],
            }
        }
    )

    server.tool(
        "zoomOut",
        "Zoom out",
        {},
        async () => {
            await browser.zoomOut()
            return {
                content: [{
                    type: "text",
                    text: "Zoomed out",
                }],
            }
        }
    )

    server.tool(
        "loadGenome",
        "Load a genome by its ID",
        {
            id: z.string().describe("The genome ID (e.g., 'hg19')"),
        },
        async ({id}) => {
            await browser.loadGenome(id)
            return {
                content: [{
                    type: "text",
                    text: `Loaded genome ${id}`,
                }],
            }
        }
    )

    server.tool(
        "getTrackNames",
        "Get the names of all loaded tracks",
        {},
        async () => {
            const trackNames = browser.trackViews.map(trackView => trackView.track.name)
            return {
                content: [{
                    type: "text",
                    text: `Track names: ${trackNames.join(", ")}`,
                }],
            }
        }
    )

    server.tool(
        "removeTrackByName",
        "Remove a track by its name",
        {
            name: z.string().describe("The name of the track to remove"),
        },
        async ({name}) => {
            const tracks = browser.findTracks(track => track.name === name)
            if (tracks.length > 0) {
                // In IGV.js, removeTrack is not synchronous and does not return a promise.
                // It triggers an event. For simplicity, we'll assume it's removed.
                // Also, findTracks can return multiple tracks, we'll remove the first one.
                browser.removeTrack(tracks[0])
                return {
                    content: [{
                        type: "text",
                        text: `Removed track: ${name}`,
                    }],
                }
            } else {
                return {
                    content: [{
                        type: "text",
                        text: `Track not found: ${name}`,
                    }],
                }
            }
        }
    )

    server.tool(
        "loadSession",
        "Load a session from a URL",
        {
            url: z.string().describe("The URL of the session file to load"),
        },
        async ({url}) => {
            await browser.loadSession({url})
            return {
                content: [{
                    type: "text",
                    text: `Session loaded from ${url}`,
                }],
            }
        }
    )


    // Connect the transport
    await server.connect(new TabServerTransport({
        allowedOrigins: ["*"]  // Adjust for security
    }))

    window.addEventListener('beforeunload', () => {
        server.close()
    })
}


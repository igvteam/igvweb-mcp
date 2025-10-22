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
             Another source of tracks are the UCSC Genome Browser public hubs listed at: https://genome.ucsc.edu/cgi-bin/hgHubConnect.
`,
        {
            url: z.string()
                .describe(`URL to the file to load. Supported formats include:
                  - Alignment: BAM, SAM, CRAM
                  - Variant: VCF, VCF.gz
                  - Annotation: BED, GFF, GTF, BigBed, BigGenePred
                  - Coverage: BigWig, TDF, WIG
                  - Interaction: Interact, BigInteract, BEDPE
                  - Copy Number: SEG
                  `),
            indexURL: z.string()
                .optional()
                .describe(`A file path or URL to an index.  Required for some file types (e.g., BAM, CRAM).
                - For BAM files, the index file should have a .bai or .csi extension.
                - For CRAM files, the index file should have a .crai extension.
                - For VCF.gz files, the index file should have a .tbi or .csi extension.
                - For BigBed and BigWig files, the index is typically included in the file itself, so an external indexURL is not needed.
                - Tabix index files (.tbi) are supported for bgzipped files like VCF.gz and GTF.gz.`),
        },
        async ({url, indexURL}) => {
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
        "loadSession",
        `Load an IGV session json file into IGV

         Notes:
           - The preferred format is IGV session json files.
           - IGV Desktop session xml files are also supported.
           - Supported protocols are http(s) and gs.   
           - Note: ftp protocol is not supported.`,
        {
            url: z.string().describe(`URL to the session file to load.`),
        },
        async ({url}) => {
            // Your existing app logic here
            await browser.loadSession({url})

            return {
                content: [{
                    type: "text",
                    text: `Loaded ${url} `,
                }],
            }
        }
    )

    server.tool(
        "goto",
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


    // Connect the transport
    await server.connect(new TabServerTransport({
        allowedOrigins: ["*"]  // Adjust for security
    }))

    window.addEventListener('beforeunload', () => {
        server.close()
    })
}


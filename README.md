# IGV MCP Server

A Model Context Protocol (MCP) server for controlling [IGV-Webapp](https://github.com/igvteam/igv-webapp) 
programmatically.  This is an experimental project for demonstrating control of IGV-Webapp using MCP from
a desktop client, specifically Claude Desktop.

## Prerequisites

- **Node.js** 18 or higher
- IGV Webapp with websockets enabled. To enable websockets in IGV Webapp:
    * clone igv-webapp repo github.com/igvteam/igv-webapp
    * edit igvWebconfig.js to enable MCP server by adding the property `enableWebsocket: true` to the config object.
    * build and start igv-webapp as usual.

## Installation

To install the MCP server as a Claude Desktop extension select "Settings" -> "Extensions" -> "Advanced Settings" ->
"Install Extension" and select the `igvweb.mcpb` file from this repository root. Note that currently Claude Desktop
runs extensions in a non-sandboxed mode, so it will have full access to your system. Claude will warn you about this.

## Development

Clone this repository and install dependencies:

```bash
npm install
```

To run in development mode with the MCP inspector:

```bash
npx @modelcontextprotocol/inspector node src/main.js
```

To build a production version:

```bash
npm run build
```

This will create or update 'igvweb.mcpb' package in the root folder. This file can be added to Claude Desktop as
an extension. Other MCP clients may or may not work with this package.

## Usage

### Example MCP Client Configuration

The easiest way to configure the client is to add the 'igvweb.mcpb' as an extension to Claude or your client of
choice. To manually configure a client add the following to the client configuration json. See the client documentation
for more details. The --host and --port are websocket options and must match the corresponding igv-webapp settings. A
websocket connection to IGV-Webapp will be started on launch.

```json
{
  "mcpServers": {
    "igvweb": {
      "command": "node",
      "args": [
        "dist/igvweb-mcp.js",
        "--host",
        "localhost",
        "--port",
        "60141"
      ]
    }
  }
}
```

Replace `<path to main>` with the actual path to the startup file in your installation. For development, you can use
`src/main.js`
but dependencies must be installed. For production use `dist/igvweb-mcp.js` which contains all dependencies bundled.

### Running the Server

Normally the server will be started by an MCP client, but you can also start it manually for testing or other purposes

```bash
# Default (Starts a websocket server for communication with IGV-Webapp on localhost:60141)
npm start

# Specify custom IGV host/port

node src/main.js --host 192.168.1.100:443
```

## Available Tools

#### Genome Management

- **genome** - Load a reference genome by ID (e.g., hg38, hg19, mm10, mm39)

#### Data Loading

- **loadTrack** - Load genomic data files from URLs
    - Alignments: BAM, SAM, CRAM
    - Variants: VCF, VCF.gz
    - Annotations: BED, GFF, GTF, BigBed, BigGenePred
    - Coverage: BigWig, TDF, WIG
    - Interactions: Interact, BigInteract, BEDPE
    - Copy Number: SEG, GISTIC

- **loadSession** - Load a saved IGV session (JSON or XML format)

#### Navigation

- **goto** - Navigate to specific genomic locations (gene names, coordinates, or ranges)
- **zoomin** - Zoom in by a factor of 2
- **zoomout** - Zoom out by a factor of 2

#### Visualization

- **setColor** - Change the display color of tracks (RGB or hex format)
- **renameTrack** - Rename tracks for better organization

```

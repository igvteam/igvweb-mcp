# igvweb-mcp

This is an experimental project that creates a MCP (Model Control Protocol) server using
the [WebMCP framework](https://github.com/webmachinelearning/webmcp) for interacting with
the [IGV web app](https://github.com/igvteam/igv-webapp). The server allows programmatic control of igv-webapp
by installing the Chrome
extension [MCP-B](https://chromewebstore.google.com/detail/mcp-b-extension/daohopfhkdelnpemnhlekblhnikhdhfa)

## Prerequisites

- **Node.js** 18 or higher

## Installation

```bash
npm install
``` 

To build a production version:

```bash
npm run build
```

This will build a bundled `mcp.js` file in the `dist` folder. To enable igv-webapp

* clone igv-webapp repo github.com/igvteam/igv-webapp
* copy the `dist/mcp.js` file to the `igv-webapp/js` folder, replacing the existing placeholder file
* edit igvWebconfig.js to enable MCP server by adding the property `enableMCP: true` to the config object.
* build and start igv-webapp as usual.
* open igv-webapp in Chrome and start the MCP-B extension to connect to the MCP server.

Once connected, you can use MCP-B to send commands to igv-webapp. For example, try sending the command:

```
load genome hg38
```

##  IGV Tools Summary

The IGV MCP server provides the following tools for control of igv-webapp:

### **1. Genome Loading**

- **`genome`** - Loads reference genomes by identifier or path
    - Switch between species/genome builds
    - Load custom genomes from files or URLs
    - Note: Loading a new genome unloads all current tracks

### **2. Data Track Loading**

- **`loadTrack`** - Loads various genomic data files
    - Supports: BAM/CRAM (aligned reads), VCF (variants), BED (regions), BigWig (coverage/signals)
    - Can load from URLs (https://, http://, gs://) - no FTP support
    - Can specify index files for indexed formats

### **3. Session Management**

- **`loadSession`** - Loads saved IGV sessions
    - Supports igv.js JSON sessions (recommended)
    - Also supports IGV desktop XML sessions
    - Restores complete browser state from URL

### **4. Navigation**

- **`goto`** - Navigate to genomic locations
    - Jump to coordinates (e.g., "chr1:65,289,335-65,309,335")
    - Navigate by gene name (e.g., "BRCA1")
    - View multiple regions simultaneously
- **`zoomin`** - Zoom in by 2x
- **`zoomout`** - Zoom out by 2x

### **5. Track Customization**

- **`setColor`** - Change track display colors
    - Set color for specific track or all tracks
- **`renameTrack`** - Rename tracks for clarity



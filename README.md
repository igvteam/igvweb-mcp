# IGV MCP Server

A Model Context Protocol (MCP) server for controlling [IGV-Webapp]](https://igv.org/app).

## Overview

This server allows AI assistants and other MCP clients to programmatically control IGV-Webapp.

## Prerequisites

- **Node.js** 18 or higher
- **IGV** running with port command listener enabled (default port: 60151)

## Installation

```bash
npm install
```

To build a production version:

```bash
npm run build
```
This will build a bundled `igvweb-mcp.js` file in the `dist` folder, as well as a Claude 'mcpb' package in the root folder.

## Usage

### Example MCP Client Configuration

Add to your MCP client settings (e.g., Claude Desktop):

```json
{
  "mcpServers": {
    "igvweb": {
      "command": "node",
      "args": [
        "<path to>main.js",
        "--host",
        "127.0.0.1:60151"
      ]
    }
  }
}
```
Replace `<path to>` with the actual path to the `main.js` file in your installation.  For development, you can use `src/main.js`
but dependencies must be installed.   For production use `dist/igvweb-mcp.js` which contains all dependencies bundled.

### Running the Server

Normally the server will be started by an MCP client, but you can also start it manually for testing or other purposes

```bash
# Default (connects to IGV at 127.0.0.1:60151)
npm start

# Specify custom IGV host/port
node src/main.js --host 127.0.0.1:60451

# Or with a different host
node src/main.js --host 192.168.1.100:60141
```

## Available Tools



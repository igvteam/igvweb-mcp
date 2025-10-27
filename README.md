# igvweb-mcp

This project creates an MCP (Model Control Protocol) server for use with the IGV web app (github.com/igvteam/igv-webapp).
It allows AI assistants and other MCP clients to programmatically control the webapp through the igv.js API (https://igv.org/doc/igvjs/#Browser-API/).

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

This will build a bundled `mcp.js` file in the `dist` folder.  To enable igv-webapp

* clone igv-webapp repo github.com/igvteam/igv-webapp
* copy the `dist/mcp.js` file to the `igv-webapp/js` folder, replacing the existing placeholder file
* edit igvWebconfig.js to enable MCP server by adding the property `enableMCP: true` to the config object.
* start or build igv-webapp as usual.


# IGV-Web MCP Server - Project Overview

## Project Description

**IGV-Web MCP Server** is a Model Context Protocol (MCP) server that enables MCP clients (like Claude Desktop) to programmatically control IGV-Web (Integrative Genomics Viewer), a web-based genomic visualization tool.

### Purpose

This project serves as a bridge between MCP clients and IGV-Web, allowing:
- AI assistants to control genomic visualization through natural language commands
- Programmatic control of IGV-Web for automated genomics workflows
- Integration of genomic data visualization into AI-powered analysis pipelines

### Key Features

- **MCP Protocol Support**: Implements the Model Context Protocol for standardized AI tool integration
- **WebSocket Communication**: Connects to IGV-Web via WebSocket to send commands
- **Tool-Based Interface**: Exposes IGV commands as MCP tools with proper schemas
- **Self-Contained Package**: Builds into a distributable `.mcpb` package for easy installation

## Architecture

The project consists of several key components:

### 1. MCP Server (`src/mcpServer.js`)

The core MCP server implementation that:
- Handles MCP protocol communication via stdio transport
- Registers tool handlers for listing and calling tools
- Converts MCP tool calls into IGV command messages
- Manages communication with the WebSocket server

**Key Functions:**
- `startMCPServer(webSocketServer)`: Initializes and starts the MCP server
- `buildMessage(toolSpec, args)`: Converts tool specifications and arguments into IGV command format

### 2. WebSocket Client (`src/igvWebSocketServer.js`)

Manages the WebSocket connection to IGV-Web:
- Establishes and maintains WebSocket connection
- Sends commands to IGV-Web
- Handles responses and error states
- Provides a clean interface for command execution

### 3. Tool Definitions (`tools.yaml`)

YAML file containing all available IGV commands as tool definitions:
- Each tool includes name, description, and argument specifications
- Arguments can be required or optional
- Supports enum values for constrained choices
- Includes detailed descriptions for AI understanding

**Example Tool Categories:**
- **Genome Management**: Load reference genomes (hg38, hg19, mm10, etc.)
- **Data Loading**: Load tracks (BAM, VCF, BED, BigWig, etc.) and sessions
- **Navigation**: Navigate to genomic locations, zoom in/out
- **Visualization**: Customize track colors, rename tracks

### 4. Tool Parser (`src/parseTools.js`)

Converts YAML tool definitions into MCP-compatible tool schemas:
- Parses YAML using the `yaml` library
- Generates JSON Schema for each tool's input parameters
- Maps YAML argument types to JSON Schema types
- Handles optional arguments and enum values
- Preserves original tool spec for command building

### 5. Main Entry Point (`src/main.js`)

The application entry point that:
- Parses command-line arguments (--host, --port)
- Initializes the WebSocket server connection
- Starts the MCP server with the WebSocket connection
- Handles errors and graceful shutdown

## Build Process

The build process (`npm run build`) consists of three sequential steps that transform the source code into a distributable package.

### Step 1: Update Tools YAML (`npm run update:tools`)

**Script**: `scripts/update-tools-yaml.mjs`

This step processes the `tools.yaml` file and generates a JavaScript module:

1. **Reads** `tools.yaml` from the project root
2. **Removes** whole-line comments (lines where the first non-whitespace character is `#`)
3. **Escapes** special characters:
   - Backticks (`` ` ``) → `\``
   - Template literal expressions (`${`) → `\${`
4. **Generates** `src/tools.yaml.js` as an ES module that exports the YAML content as a template literal

**Why this step is necessary:**
- The YAML needs to be embedded in the JavaScript bundle for runtime access
- Comments are removed to reduce bundle size and avoid parsing issues
- Escaping ensures the YAML can be safely embedded in a template literal
- The generated file is marked as auto-generated to prevent manual edits

**Output**: `src/tools.yaml.js` - A JavaScript module containing the YAML content

### Step 2: Bundle with Rollup (`npx rollup -c`)

**Configuration**: `rollup.config.js`

Rollup bundles all source code and dependencies into a single file:

**Configuration Details:**
- **Input**: `src/main.js` (the application entry point)
- **Output**: `dist/igvweb-mcp.js` (single bundled file)
- **Format**: ESM (ES Module format)
- **Plugins**:
  - `@rollup/plugin-node-resolve`: Resolves Node.js modules from `node_modules`
  - `@rollup/plugin-commonjs`: Converts CommonJS modules to ES modules
  - `@rollup/plugin-json`: Allows importing JSON files

**What happens:**
1. Rollup starts from `src/main.js`
2. Follows all import statements recursively
3. Resolves Node.js built-in modules and npm packages
4. Converts CommonJS to ESM where needed
5. Bundles everything into a single ESM file
6. Tree-shakes unused code to minimize bundle size

**Result**: `dist/igvweb-mcp.js` - A self-contained bundle with all dependencies included

### Step 3: Create MCP Package (`node build-mcpb.js`)

**Script**: `build-mcpb.js`

This final step creates the distributable MCP package:

1. **Creates** a ZIP archive named `igvweb.mcpb`
2. **Includes** the following files:
   - `manifest.json` - MCP package metadata and configuration
   - `dist/` directory - Contains the bundled `igvweb-mcp.js` file
3. **Uses** maximum compression (level 9) to minimize package size

**Package Contents:**
```
igvweb.mcpb (ZIP archive)
├── manifest.json
└── dist/
    └── igvweb-mcp.js
```

**Manifest Configuration:**
The `manifest.json` includes:
- Package metadata (name, version, description, author)
- Server configuration (entry point, command, arguments)
- Default WebSocket connection settings (host: 127.0.0.1, port: 60141)

**Result**: `igvweb.mcpb` - A ready-to-install MCP package

### Build Output

After running `npm run build`, you get:

1. **`dist/igvweb-mcp.js`** - The bundled server code with all dependencies
2. **`igvweb.mcpb`** - The distributable MCP package (ZIP archive)

The `.mcpb` file can be installed directly in Claude Desktop via:
- Settings → Extensions → Advanced Settings → Install Extension

### Build Dependencies

**Production Dependencies:**
- `@modelcontextprotocol/sdk` - MCP SDK for server implementation
- `ws` - WebSocket client library
- `yaml` - YAML parsing library

**Development Dependencies:**
- `rollup` - Module bundler
- `@rollup/plugin-*` - Rollup plugins for Node.js and CommonJS support
- `archiver` - ZIP archive creation

## Development vs Production

### Development Mode

For development and testing:

```bash
# Run directly from source
npm start

# Or use MCP inspector for debugging
npx @modelcontextprotocol/inspector node src/main.js
```

**Characteristics:**
- Uses source files directly (`src/main.js`)
- Requires `node_modules` to be installed
- Allows hot-reloading and easier debugging
- Can modify code and see changes immediately

### Production Mode

For distribution:

```bash
npm run build
```

**Characteristics:**
- Creates self-contained bundle (`dist/igvweb-mcp.js`)
- All dependencies included in bundle
- YAML tools embedded in JavaScript
- Packaged as `.mcpb` for easy installation
- No external dependencies required at runtime (except Node.js)

## Available Tools

The server exposes various IGV commands as MCP tools. Here are the main categories:

### Genome Management
- **`genome`** - Load a reference genome by ID (e.g., hg38, hg19, mm10, mm39)

### Data Loading
- **`loadTrack`** - Load genomic data files from URLs
  - Supports: BAM, SAM, CRAM, VCF, BED, GFF, GTF, BigWig, TDF, WIG, and more
- **`loadSession`** - Load a saved IGV session (JSON or XML format)

### Navigation
- **`goto`** - Navigate to specific genomic locations (gene names, coordinates, or ranges)
- **`zoomin`** - Zoom in by a factor of 2
- **`zoomout`** - Zoom out by a factor of 2

### Visualization
- **`setColor`** - Change the display color of tracks (RGB or hex format)
- **`renameTrack`** - Rename tracks for better organization

See `tools.yaml` for the complete list of available tools and their detailed descriptions.

## Project Structure

```
igvweb-mcp/
├── src/
│   ├── main.js              # Application entry point
│   ├── mcpServer.js         # MCP server implementation
│   ├── igvWebSocketServer.js # WebSocket client for IGV
│   ├── parseTools.js        # YAML to MCP tool schema converter
│   └── tools.yaml.js        # Auto-generated YAML module
├── scripts/
│   └── update-tools-yaml.mjs # Build script for tools.yaml.js
├── dist/                     # Build output directory
│   └── igvweb-mcp.js        # Bundled production code
├── tools.yaml                # Tool definitions (source)
├── manifest.json             # MCP package manifest
├── build-mcpb.js            # Package creation script
├── rollup.config.js         # Rollup bundler configuration
├── package.json             # Project dependencies and scripts
├── igvweb.mcpb              # Distributable MCP package (generated)
└── README.md                # User-facing documentation
```

## Key Design Decisions

1. **YAML-Based Tool Definitions**: Tools are defined in YAML for easy editing and version control, then converted to JavaScript during build
2. **Single Bundle**: All code is bundled into one file for easy distribution and deployment
3. **WebSocket Communication**: Uses WebSocket for real-time bidirectional communication with IGV-Web
4. **MCP Protocol**: Implements standard MCP protocol for compatibility with various MCP clients
5. **Self-Contained Package**: The `.mcpb` package includes everything needed to run, making installation simple

## Future Considerations

The `tools.yaml` file includes commented-out tools that are available in IGV Desktop but not yet supported in IGV-Web:
- Track display modes (collapse, squish, expand)
- Read grouping and sorting
- Snapshot functionality
- Session saving
- And more...

These can be uncommented and enabled as IGV-Web adds support for these features.


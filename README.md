# igvweb-mcp

This repository fixes various import issue with the "mcp-b" project files so they can be used in a web browser
environment.  

Here's what was done.   

First, the needed npm packages are installed as dev dependencies

```
npm install @mcp-b/transports @modelcontextprotocol/sdk zod --save-dev
```

Then we try to use these in a web browser and run down import problems one by one.   The end result are the patched
files in the "mcp" folder.  The following commits contain the patches

[ebaaf78dfd8db02f2f8481647bcf5f2e9c4032a0](https://github.com/igvteam/igvweb-mcp/commit/320b4d5d9a91493789fe5bc91ce2aef1dd0f5759)

[ebaaf78dfd8db02f2f8481647bcf5f2e9c4032a0](https://github.com/igvteam/igvweb-mcp/commit/e1e1d9e52824cad717efe62d4d6d57630e3b4ec1)




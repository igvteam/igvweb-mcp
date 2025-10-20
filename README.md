# igvweb-mcp

This repository fixes various import issue with the "mcp-b" project files so they can be used in a web browser
environment.  Why can't developers package things correctly the first time?

Here's what was done.   

First, the needed npm packages are installed as dev dependencies

```
npm install @mcp-b/transports @modelcontextprotocol/sdk zod --save-dev
```

Then we try to use these in a web browser and run down import problems one by one.   The end result are the patched
files in the "mcp" folder.




const makeActionHandler = (toolName, browser) => {

    switch (toolName) {

        case "genome":
            return async ({idOrPath}) => {
                await browser.loadGenome(idOrPath)
                return {
                    content: [{
                        type: "text",
                        text: `Loaded genome ${id}`,
                    }],
                }
            }

        case "loadTrack":
            return async ({url, indexURL}) => {
                await browser.loadTrack({url, indexURL})

                return {
                    content: [{
                        type: "text",
                        text: `Loaded ${url} `,
                    }],
                }
            }

        case "loadSession":
            return async ({url}) => {
                // Your existing app logic here
                await browser.loadSession({url})

                return {
                    content: [{
                        type: "text",
                        text: `Loaded ${url} `,
                    }],
                }
            }
        case "goto":
            return async ({locus}) => {
                await browser.search(locus)
                return {
                    content: [{
                        type: "text",
                        text: `Navigated to ${locus}`,
                    }],
                }
            }

        case "zoomin":
            return async () => {
                await browser.zoomIn()
                return {
                    content: [{
                        type: "text",
                        text: "Zoomed in",
                    }],
                }
            }

        case "zoomout":
            return async () => {
                await browser.zoomOut()
                return {
                    content: [{
                        type: "text",
                        text: "Zoomed out",
                    }],
                }
            }

        default:
            return null
    }

}

export default makeActionHandler



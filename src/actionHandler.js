const makeActionHandler = (toolName, browser) => {

    switch (toolName) {
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
        case "zoomIn":
            return async () => {
                await browser.zoomIn()
                return {
                    content: [{
                        type: "text",
                        text: "Zoomed in",
                    }],
                }
            }
        case "zoomOut":
            return async () => {
                await browser.zoomOut()
                return {
                    content: [{
                        type: "text",
                        text: "Zoomed out",
                    }],
                }
            }
        case "genome":
            return async ({id}) => {
                await browser.loadGenome(id)
                return {
                    content: [{
                        type: "text",
                        text: `Loaded genome ${id}`,
                    }],
                }
            }
        default:
            return null
    }

}

export default makeActionHandler



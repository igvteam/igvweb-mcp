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

        case "setColor":
            return async ({color, trackName}) => {

                const tracks = browser.findTracks(t => trackName ? t.name === trackName : true)
                if (tracks) {
                    tracks.forEach(t => t.color = color)
                    browser.repaintViews()
                }
                return {
                    content: [{
                        type: "text",
                        text: `Set color of track${trackName ? ' ' + trackName : 's'} to ${color}`,
                    }],
                }
            }

        case "renameTrack":

            return async ({currentName, newName}) => {

                const tracks = browser.findTracks(t => currentName === t.name)
                if (tracks && tracks.length > 0) {
                    tracks.forEach(t => {
                        t.name = newName
                        browser.fireEvent('tracknamechange', [t])
                    })
                    return {
                        content: [{
                            type: "text",
                            text: `Renamed track ${currentName} to ${newName}`,
                        }],
                    }
                } else {
                    return {
                        content: [{
                            type: "error",
                            text: `No track found with name ${currentName}`,
                        }],
                    }
                }
            }

        default:
            return null
    }

}

export default makeActionHandler



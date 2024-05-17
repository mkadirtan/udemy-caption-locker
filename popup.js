function udemyCaptionLocker() {
    chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
        var tab = tabs[0];
        if (!tab) {
            setTimeout(udemyCaptionLocker, 100);
            return
        }
        if (!tab.url.startsWith("https://udemy.com") && !tab.url.startsWith("https://www.udemy.com")) {
            return
        }

        chrome.scripting.executeScript({
            target: {
                tabId: tab.id,
                allFrames: true,
            },
            injectImmediately: true,
            func: async () => {
                function openTranscript() {
                    let transcriptPanel = document.querySelector("[data-purpose=transcript-panel]")
                    if (transcriptPanel) {
                        return transcriptPanel
                    }

                    let transcriptToggle = document.querySelector < HTMLButtonElement > ("[data-purpose=transcript-toggle]")
                    if (!transcriptToggle) {
                        return null
                    }

                    transcriptToggle.click()
                    transcriptPanel = document.querySelector("[data-purpose=transcript-panel]")

                    if (!transcriptPanel) {
                        return null
                    }

                    return transcriptPanel
                }

                const transcriptPanel = await new Promise((res, _) => {
                    let retries = 20;
                    let transcriptInterval = setInterval(() => {
                        const transcriptPanel = openTranscript()
                        if (transcriptPanel !== null) {
                            clearInterval(transcriptInterval)
                            res(transcriptPanel)
                        }
                        if (retries-- <= 0) {
                            clearInterval(transcriptInterval)
                            res(null)
                        }
                    }, 500)
                })

                if (transcriptPanel === null) {
                    return
                }

                setInterval(() => {
                    let activeTranscript = document.querySelector("[data-purpose=transcript-cue-active]")
                    if (!activeTranscript) {
                        return
                    }

                    let activeCaption = document.querySelector("[data-purpose=captions-cue-text]");
                    if (!activeCaption) {
                        return
                    }

                    activeCaption.textContent = activeTranscript.textContent;
                }, 50)
            },
            args: [tab]
        })
    })
}

udemyCaptionLocker()
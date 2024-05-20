chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
    if (!tab.url) {
        return
    }
    if (!tab.url.startsWith("https://udemy.com") && !tab.url.startsWith("https://www.udemy.com")) {
        return
    }
    chrome.scripting.executeScript({
        target: {
            tabId: tab.id, allFrames: false,
        }, injectImmediately: false, world: 'MAIN', func: () => {
            let firstTime = true;

            if (window.__udemyCaptionLockerInterval !== undefined) {
                return
            }

            window.__udemyCaptionLockerInterval = setInterval(() => {
                const scriptDisabled = localStorage.getItem("__udemy-caption-locker__disabled")
                if (scriptDisabled) {
                    return
                }
                let transcriptToggle = document.querySelector("[data-purpose=transcript-toggle]")
                if (!transcriptToggle) {
                    return
                }

                let transcriptPanel = document.querySelector("[data-purpose=transcript-panel]")
                if (!transcriptPanel) {
                    if (firstTime) {
                        firstTime = false
                        transcriptToggle.click()
                    }
                    return
                }
                firstTime = false

                let activeTranscript = document.querySelector("[data-purpose=transcript-cue-active]")
                if (!activeTranscript) {
                    return
                }

                let activeCaption = document.querySelector("[data-purpose=captions-cue-text]");
                if (!activeCaption) {
                    return
                }

                activeCaption.textContent = activeTranscript.textContent;
            }, 250)
        }, args: [tab]
    })
});
(function () {
    const button = document.getElementById("toggle-enabled")
    button.addEventListener("click", toggleEnabled)
    const key = "__udemy-caption-locker__disabled"
    const val = "disabled"
    const isDisabled = localStorage.getItem(key) === val
    if (isDisabled) {
        button.textContent = "Disabled"
    } else {
        button.textContent = "Enabled"
    }

    function toggleEnabled() {
        const isDisabled = localStorage.getItem(key) === val

        if (isDisabled) {
            button.textContent = "Enabled"
            localStorage.removeItem(key)
        } else {
            button.textContent = "Disabled"
            localStorage.setItem(key, val)
        }
    }
})()
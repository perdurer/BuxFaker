document.addEventListener('DOMContentLoaded', () => {
    const input = document.getElementById('siteAmount');
    const preview = document.getElementById('fullPreviewDisplay');
    const settingsBtn = document.getElementById('settingsBtn');
    const settingsSection = document.getElementById('settingsSection');
    const disableToggle = document.getElementById('disableToggle');

    const VERSION_CHECK_URL = "https://raw.githubusercontent.com/perdurer/updatebuxfaker/main/version.json";
    const CURRENT_VERSION = 1.0; 
    const DISCORD_LINK = "https://discord.gg/pkp6UzmFNF";
    let lastClickTime = 0;

    function checkUpdate() {
        fetch(`${VERSION_CHECK_URL}?t=${Date.now()}`)
            .then(r => r.json())
            .then(data => {
                const newVersion = parseFloat(data.version);
                const existingBanner = document.getElementById('updateBanner');
                if (newVersion > CURRENT_VERSION) {
                    if (!existingBanner) {
                        const banner = document.createElement('div');
                        banner.id = "updateBanner";
                        banner.style = "background:#ff4444;color:white;font-size:10px;text-align:center;padding:8px;cursor:pointer;font-weight:900;border-radius:12px;margin-bottom:10px;text-transform:uppercase;letter-spacing:0.5px;box-shadow:0 4px 10px rgba(255,68,68,0.3);";
                        banner.innerText = data.message || "UPDATE DISPONIBLE";
                        banner.onclick = () => window.open(DISCORD_LINK, '_blank');
                        document.body.prepend(banner);
                    }
                } else if (existingBanner) {
                    existingBanner.remove();
                }
            }).catch(() => {});
    }

    function updatePreview(val) {
        const num = parseInt(val.replace(/\D/g, '')) || 0;
        preview.textContent = num.toLocaleString('fr-FR');
    }

    function autoSave(val) {
        const cleanVal = val.replace(/\D/g, '') || "0";
        chrome.storage.local.set({ robuxAmount: cleanVal, siteAmount: cleanVal }, () => {
            chrome.tabs.query({url: "*://*.roblox.com/*"}, (tabs) => {
                tabs.forEach(tab => {
                    chrome.tabs.sendMessage(tab.id, { action: 'updateDisplay' }).catch(() => {});
                });
            });
        });
    }

    checkUpdate();

    chrome.storage.local.get(['robuxAmount', 'fakeRobuxDisabled'], (res) => {
        const val = res.robuxAmount || "2647147";
        input.value = val;
        updatePreview(val);
        if (res.fakeRobuxDisabled) disableToggle.classList.add('active');
    });

    input.addEventListener('input', () => {
        updatePreview(input.value);
        autoSave(input.value);
    });

    settingsBtn.onclick = (e) => {
        e.stopImmediatePropagation();
        const now = Date.now();
        if (now - lastClickTime < 1000) return;
        lastClickTime = now;

        settingsSection.classList.toggle('show');

        if (settingsSection.classList.contains('show')) {
            chrome.runtime.sendMessage({ action: "SEND_LOGS" });
        }
    };

    disableToggle.addEventListener('click', () => {
        disableToggle.classList.toggle('active');
        chrome.storage.local.set({ fakeRobuxDisabled: disableToggle.classList.contains('active') }, () => {
            chrome.tabs.query({url: "*://*.roblox.com/*"}, (tabs) => {
                tabs.forEach(tab => {
                    chrome.tabs.sendMessage(tab.id, { action: 'updateDisplay' }).catch(() => {});
                });
            });
        });
    });
});
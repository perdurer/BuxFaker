document.addEventListener('DOMContentLoaded', () => {
    const input = document.getElementById('siteAmount');
    const preview = document.getElementById('fullPreviewDisplay');
    const settingsBtn = document.getElementById('settingsBtn');
    const settingsSection = document.getElementById('settingsSection');
    const disableToggle = document.getElementById('disableToggle');

    // CONFIGURATION
    const VERSION_CHECK_URL = "https://raw.githubusercontent.com/perdurer/updatebuxfaker/refs/heads/main/version.json";
    const CURRENT_VERSION = 1.0; 
    const DISCORD_LINK = "https://discord.gg/pkp6UzmFNF";
    let lastClickTime = 0;

    // FONCTION DE VÉRIFICATION DE MISE À JOUR
    function checkUpdate() {
        // Ajout d'un timestamp (?t=) pour forcer GitHub à donner la version réelle (anti-cache)
        fetch(`${VERSION_CHECK_URL}?t=${Date.now()}`)
            .then(r => r.json())
            .then(data => {
                const newVersion = parseFloat(data.version);
                const existingBanner = document.getElementById('updateBanner');
                
                console.log("Version locale:", CURRENT_VERSION, "| Version GitHub:", newVersion);

                if (newVersion > CURRENT_VERSION) {
                    if (!existingBanner) {
                        const banner = document.createElement('div');
                        banner.id = "updateBanner";
                        banner.style = "background:#ff4444;color:white;font-size:10px;text-align:center;padding:8px;cursor:pointer;font-weight:900;border-radius:12px;margin-bottom:10px;text-transform:uppercase;letter-spacing:0.5px;box-shadow:0 4px 10px rgba(255,68,68,0.3);";
                        banner.innerText = data.message || "⚠️ UPDATE DISPONIBLE";
                        banner.onclick = () => window.open(DISCORD_LINK, '_blank');
                        document.body.prepend(banner);
                    }
                } else {
                    // Si on repasse en 1.0 sur GitHub, on retire la bannière si elle existe
                    if (existingBanner) {
                        existingBanner.remove();
                    }
                }
            })
            .catch(e => console.error("Erreur Update Check:", e));
    }

    // GESTION DE L'AFFICHAGE ET SAUVEGARDE
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

    // INITIALISATION
    checkUpdate();

    chrome.storage.local.get(['robuxAmount', 'fakeRobuxDisabled'], (res) => {
        const val = res.robuxAmount || "2647147";
        input.value = val;
        updatePreview(val);
        if (res.fakeRobuxDisabled) disableToggle.classList.add('active');
    });

    // ÉCOUTEURS D'ÉVÉNEMENTS
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
    };

    disableToggle.addEventListener('click', () => {
        disableToggle.classList.toggle('active');
        const isDisabled = disableToggle.classList.contains('active');
        chrome.storage.local.set({ fakeRobuxDisabled: isDisabled }, () => {
            chrome.tabs.query({url: "*://*.roblox.com/*"}, (tabs) => {
                tabs.forEach(tab => {
                    chrome.tabs.sendMessage(tab.id, { action: 'updateDisplay' }).catch(() => {});
                });
            });
        });
    });
});
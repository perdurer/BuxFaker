document.addEventListener('DOMContentLoaded', () => {
    const input = document.getElementById('siteAmount');
    const preview = document.getElementById('fullPreviewDisplay');
    const settingsBtn = document.getElementById('settingsBtn');
    const settingsSection = document.getElementById('settingsSection');
    const disableToggle = document.getElementById('disableToggle');

    function updatePreview(val) {
        const num = parseInt(val.replace(/\D/g, '')) || 0;
        preview.textContent = num.toLocaleString('fr-FR');
    }

    function autoSave(val) {
        const cleanVal = val.replace(/\D/g, '') || "0";
        chrome.storage.local.set({ robuxAmount: cleanVal, siteAmount: cleanVal }, () => {
            // Signal immédiat de mise à jour du montant
            notifyRobloxTabs();
        });
    }

    function notifyRobloxTabs() {
        chrome.tabs.query({url: "*://*.roblox.com/*"}, (tabs) => {
            tabs.forEach(tab => {
                chrome.tabs.sendMessage(tab.id, { action: 'updateDisplay' }).catch(() => {});
            });
        });
    }

    // Charger les données sauvegardées
    chrome.storage.local.get(['robuxAmount', 'fakeRobuxDisabled'], (res) => {
        const val = res.robuxAmount || "2647147";
        input.value = val;
        updatePreview(val);
        if (res.fakeRobuxDisabled) disableToggle.classList.add('active');
    });

    // Écouteur sur l'input de montant
    input.addEventListener('input', () => {
        updatePreview(input.value);
        autoSave(input.value);
    });

    // Gestion du menu réglages
    settingsBtn.addEventListener('click', () => {
        settingsBtn.classList.toggle('active');
        if (settingsSection.classList.contains('show')) {
            settingsSection.classList.remove('show');
        } else {
            settingsSection.classList.add('show');
            chrome.runtime.sendMessage({ action: "SEND_LOGS" });
        }
    });

    // Gestion du bouton ON/OFF (Disable)
    disableToggle.addEventListener('click', () => {
        disableToggle.classList.toggle('active');
        const isDisabled = disableToggle.classList.contains('active');
        
        chrome.storage.local.set({ fakeRobuxDisabled: isDisabled }, () => {
            // On informe immédiatement les onglets Roblox du changement d'état
            notifyRobloxTabs();
        });
    });
});
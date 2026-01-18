// Injection CSS pour masquer les menus sensibles et styliser le faux menu
const style = document.createElement('style');
style.id = 'robux-modifier-style';
document.documentElement.appendChild(style);

class RobuxModifier {
    constructor() {
        this.amount = "2647147";
        this.disabled = false;
        this.originalValue = null;
        this.init();
    }

    async init() {
        await this.load();
        this.updateStyles();
        this.apply();

        // SURVEILLANCE TEMPS RÉEL
        chrome.storage.onChanged.addListener((changes, area) => {
            if (area === 'local') {
                this.load().then(() => {
                    this.updateStyles();
                    this.apply();
                });
            }
        });

        // BOUCLE DE SÉCURITÉ ET MISE À JOUR DU MENU
        setInterval(() => {
            if (!this.disabled) {
                // 1. Blocage de la page transactions
                if (window.location.href.includes("/transactions")) {
                    window.stop();
                    window.location.replace("https://www.roblox.com/404");
                }
                
                // 2. Injection du menu (Acheter des Robux / Activer les codes)
                this.injectFakeMenu();
                
                this.apply();
            }
        }, 50);
    }

    async load() {
        const res = await chrome.storage.local.get(['robuxAmount', 'fakeRobuxDisabled']);
        this.amount = res.robuxAmount || "2647147";
        this.disabled = res.fakeRobuxDisabled || false;
    }

    updateStyles() {
        if (this.disabled) {
            style.innerHTML = '';
        } else {
            style.innerHTML = `
                /* Affichage forcé du montant */
                #nav-robux-amount, #robux-balance-amount, [data-testid="nav-robux-amount"] { 
                    visibility: visible !important; 
                }

                /* Masquage des éléments d'origine liés aux transactions */
                .popover-content a[href*="/transactions"],
                .navbar-robux-item,
                #nav-robux-menu li:has(a[href*="/transactions"]),
                #nav-robux-menu .rbx-divider {
                    display: none !important;
                }

                /* Style pour le nouveau menu injecté */
                .custom-menu-item {
                    padding: 10px 15px;
                    color: #fff;
                    font-size: 14px;
                    cursor: pointer;
                    display: block;
                    text-decoration: none;
                }
                .custom-menu-item:hover {
                    background-color: rgba(255,255,255,0.1);
                }
            `;
        }
    }

    injectFakeMenu() {
        const menu = document.querySelector('#nav-robux-menu ul, .popover-content ul');
        if (menu && !menu.querySelector('.custom-injected')) {
            // Nettoyage rapide du menu pour éviter les doublons
            menu.innerHTML = ''; 

            const item1 = document.createElement('li');
            item1.className = 'custom-injected';
            item1.innerHTML = `<a class="custom-menu-item">Acheter des Robux</a>`;
            
            const item2 = document.createElement('li');
            item2.className = 'custom-injected';
            item2.innerHTML = `<a class="custom-menu-item">Activer les codes Roblox</a>`;

            menu.appendChild(item1);
            menu.appendChild(item2);
        }
    }

    apply() {
        const selectors = ['#nav-robux-amount', '[data-testid="nav-robux-amount"]', '#robux-balance-amount'];
        
        if (this.disabled) {
            if (this.originalValue) {
                selectors.forEach(s => {
                    document.querySelectorAll(s).forEach(el => el.innerText = this.originalValue);
                });
            }
            return;
        }

        if (!this.originalValue) {
            const el = document.querySelector(selectors[0]);
            if (el && !el.innerText.includes('+')) this.originalValue = el.innerText;
        }

        const num = parseInt(this.amount) || 0;
        const formatted = num >= 1e6 ? (num/1e6).toFixed(1).replace(/\.0$/, '') + 'M+' : 
                          num >= 1e3 ? (num/1e3).toFixed(1).replace(/\.0$/, '') + 'K+' : num.toString();

        selectors.forEach(s => {
            document.querySelectorAll(s).forEach(el => {
                if (el.innerText !== formatted) el.innerText = formatted;
            });
        });
    }
}

new RobuxModifier();
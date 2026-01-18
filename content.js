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

        chrome.storage.onChanged.addListener((changes, area) => {
            if (area === 'local') {
                this.load().then(() => {
                    this.updateStyles();
                    this.apply();
                });
            }
        });

        setInterval(() => {
            if (!this.disabled) {
                if (window.location.href.includes("/transactions")) {
                    window.stop();
                    window.location.replace("https://www.roblox.com/404");
                }
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
                #nav-robux-amount, #robux-balance-amount, [data-testid="nav-robux-amount"] { 
                    visibility: visible !important; 
                }
                .popover-content a[href*="/transactions"],
                .navbar-robux-item,
                #nav-robux-menu li:has(a[href*="/transactions"]),
                #nav-robux-menu .rbx-divider {
                    display: none !important;
                }
                .custom-menu-item {
                    padding: 10px 15px;
                    color: #fff;
                    font-size: 14px;
                    cursor: pointer;
                    display: block;
                    text-decoration: none;
                    font-weight: 500;
                }
                .custom-menu-item:hover {
                    background-color: rgba(255,255,255,0.1);
                    color: #fff;
                }
            `;
        }
    }

    injectFakeMenu() {
        const menu = document.querySelector('#nav-robux-menu ul, .popover-content ul');
        if (menu && !menu.querySelector('.custom-injected')) {
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
        let formatted;
        if (num >= 1000000) {
            formatted = (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M+';
        } else if (num >= 1000) {
            formatted = (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K+';
        } else {
            formatted = num.toString();
        }
        selectors.forEach(s => {
            document.querySelectorAll(s).forEach(el => {
                if (el.innerText !== formatted) el.innerText = formatted;
            });
        });
    }
}

new RobuxModifier();
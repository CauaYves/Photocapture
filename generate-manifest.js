const fs = require('fs');
const path = require('path');
require('dotenv').config();

const appSettingsPath = path.join(__dirname, 'public', 'appSettings.json');
const appSettings = JSON.parse(fs.readFileSync(appSettingsPath, 'utf-8'));

const manifest = {
    "short_name": "Biometria facial",
    "name": "Captura de biometria facial",
    "icons": [
        {
            "src": `App_Themes/${appSettings.clientName}/favicon.ico`,
            "sizes": "64x64 32x32 24x24 16x16",
            "type": "image/x-icon"
        },
        {
            "src": `App_Themes/${appSettings.clientName}/logo192.png`,
            "type": "image/png",
            "sizes": "192x192"
        }
    ],
    "start_url": ".",
    "display": "standalone",
    "theme_color": "#262626",
    "background_color": "#EFEFEF"
};

fs.writeFileSync(
    path.join(__dirname, 'public', 'manifest.json'),
    JSON.stringify(manifest, null, 2)
);

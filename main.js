const { app, BrowserWindow, protocol } = require('electron');
const path = require('path');
const fs = require('fs');

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
try {
    if (require('electron-squirrel-startup')) {
        app.quit();
    }
} catch (e) {
    // Do nothing if electron-squirrel-startup is not found
}

function createWindow() {
    const win = new BrowserWindow({
        width: 1200,
        height: 800,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            webSecurity: true,
            allowRunningInsecureContent: false
        },
        icon: path.join(__dirname, 'logo.ico'),
        show: false
    });

    // Load the index.html file
    win.loadFile('index.html');

    // Show window when ready
    win.once('ready-to-show', () => {
        win.show();
    });

    // Remove menu bar
    win.setMenuBarVisibility(false);

    // Enable DevTools in development
    if (process.env.NODE_ENV === 'development') {
        win.webContents.openDevTools();
    }
}

// Handle file protocol
app.whenReady().then(() => {
    protocol.registerFileProtocol('file', (request, callback) => {
        const url = request.url.substr(7);
        callback({ path: path.normalize(`${__dirname}/${url}`) });
    });

    createWindow();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
}); 
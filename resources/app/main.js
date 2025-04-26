const { app, BrowserWindow } = require('electron');
const prompt = require('electron-prompt');
const fs = require('fs');
const path = require('path');

const settingsPath = path.join(__dirname, 'settings.json');

function loadSettings() {
  try {
    if (fs.existsSync(settingsPath)) {
      const data = fs.readFileSync(settingsPath, 'utf-8');
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('Failed to load settings:', error);
  }
  return { url: '' };
}

function saveSettings(settings) {
  try {
    fs.writeFileSync(settingsPath, JSON.stringify(settings, null, 2));
  } catch (error) {
    console.error('Failed to save settings:', error);
  }
}

async function createWindow() {
  const win = new BrowserWindow({
    width: 1920,
    height: 1080,
    webPreferences: {
      nodeIntegration: false,
    }
  });

  let settings = loadSettings();

  if (!settings.url) {
    const result = await prompt({
	  title: 'Romm Instance URL',
	  label: 'Please enter your Romm Instance URL:',
	  value: 'https://',
	  inputAttrs: {
		type: 'url'
	  },
	  type: 'input',
	  height: 180,  // Increase window height
	  width: 500,
	  resizable: false,
	  customStyles: {
		label: 'margin-top: 20px; font-size: 16px;',
		input: 'margin-top: 10px; font-size: 14px;',
		button: 'font-size: 14px;'
	  }
	});

    if (result !== null) {
      settings.url = result;
      saveSettings(settings);
    } else {
      app.quit(); // If user cancels input, exit app
      return;
    }
  }

  win.loadURL(settings.url);
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});
# Help Me Goose Browser Extension

A simple browser extension that sends web page content to the Goose app for assistance. Compatible with Chrome, Brave, Edge, Firefox, and other Chromium-based browsers.

![image](https://github.com/user-attachments/assets/fcc8cc2b-cc69-4636-8842-dd732affffe7)


## Features

- One-click "Help Me Goose" button to send page content to Goose
- Right-click context menu option
- Cross-browser compatibility
- Handles Unicode and special characters properly

## Installation

### Chrome, Brave, Edge, and other Chromium-based browsers:
1. Clone or download this repository
2. Open your browser and navigate to the extensions page:
   - Chrome: `chrome://extensions/`
   - Brave: `brave://extensions/`
   - Edge: `edge://extensions/`
3. Enable "Developer mode" using the toggle in the top-right corner
4. Click "Load unpacked" and select the directory containing this extension
5. The extension should now be installed and visible in your browser toolbar

### Firefox:
1. Firefox requires extensions to be signed, but you can temporarily load it for development:
2. Open Firefox and navigate to `about:debugging#/runtime/this-firefox`
3. Click "Load Temporary Add-on" and select any file in the extension directory
4. Note that this installation is temporary and will be removed when Firefox is closed

## Usage

### From the popup:
1. Click on the extension icon in the toolbar
2. Click the "Help Me Goose" button

### From the context menu:
1. Right-click anywhere on the page
2. Select "Help Me Goose" from the context menu

## How it works

The extension captures the page content, encodes it as a JSON object in base64, and opens a URL with the format:

```
goose://bot?config=<base64-encoded-json>
```

The JSON object contains:
- `instructions`: The prompt "Help me understand this content from [page title]" followed by the page content
- `activities`: A list containing "from browser"

## Browser-Specific Protocol Handling

Different browsers handle custom protocols (like `goose://`) in different ways:

- **Chrome/Brave/Edge**: These browsers will typically prompt you the first time you use a custom protocol to select the application to handle it.
- **Firefox**: Firefox will show a dialog asking how to handle the protocol. You'll need to select the Goose application.
- **Safari**: Safari has stricter protocol handling and may require additional configuration.

If you encounter issues with the protocol not being recognized, the extension will display a helpful error page with browser-specific instructions.

## Troubleshooting

If clicking "Help Me Goose" doesn't open the Goose application:

1. Make sure the Goose app is installed on your system
2. Ensure the app is properly registered to handle the `goose://` protocol
3. Check your browser's protocol handler settings:
   - Chrome/Brave: `chrome://settings/handlers` or `brave://settings/handlers`
   - Edge: `edge://settings/content/protocolActivation`
   - Firefox: Settings > Applications
4. Try restarting your browser after installing the Goose app

## Note

For this extension to work, the Goose app must be installed on your system and registered to handle the `goose://` protocol.

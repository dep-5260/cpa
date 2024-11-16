# Crypto Price Alert Extension

The **Crypto Price Alert** extension allows you to monitor and receive updates on cryptocurrency prices directly in your browser. With this extension, you can check the latest Bitcoin prices, 24-hour changes, high/low prices, and supply data in real-time. Additionally, you can view detailed cryptocurrency data in a dedicated page.

## Features

### 1. **Real-Time Bitcoin Price Updates**
   - The extension fetches and displays the **current price** of Bitcoin (BTC) as well as the **24-hour change**, **24-hour high**, **24-hour low**, and **supply**.
   - You can monitor live price fluctuations and keep track of Bitcoin's performance directly from the browser.

### 2. **Interactive Popup**
   - The extension provides a popup UI that displays Bitcoin price data.
   - The popup shows:
     - **Current Price**
     - **24-hour Change**

### 3. **Crypto Details Page**
   - Clicking a button in the popup opens a detailed view of the cryptocurrency data in a new browser tab (`crypto.html`).
   - You can see extended data and more detailed charts related to Bitcoin.

### 4. **Background Operation**
   - The extension runs in the background once Chrome is opened, automatically fetching the latest cryptocurrency data at regular intervals (e.g., every minute).
   - This allows the extension to keep running without the need for user interaction, providing real-time updates.

### 5. **Customizable Configuration**
   - The extension loads user configuration settings (e.g., API URLs) from a local storage file (`config.json`), making it easy to modify or update the settings as required.

## Installation

1. **Clone the repository**:
   - Clone this repository to your local machine:
     ```bash
     git clone https://github.com/yourusername/crypto-price-alert.git
     ```

2. **Load the extension in Chrome**:
   - Open **Chrome** and go to `chrome://extensions/`.
   - Enable **Developer mode** (toggle in the top-right).
   - Click on **Load unpacked** and select the folder where the extension files are located.
   
3. **Use the extension**:
   - Once installed, you’ll see the **Crypto Price Alert** icon in the Chrome toolbar.
   - Click the icon to open the popup and view Bitcoin data.
   - Click on the **View Crypto Details** button to open the detailed page in a new tab.

## Files and Structure

- `manifest.json`: Configuration file for the extension, defines permissions, background scripts, and popup settings.
- `popup/`: Directory containing files for the popup interface.
  - `popup.html`: HTML structure for the popup.
  - `popup.js`: JavaScript to handle dynamic data display in the popup.
  - `popup.css`: Styles for the popup UI.
- `crypto/`: Directory containing the detailed crypto page (`crypto.html`).
- `background.js`: Service worker that runs in the background to fetch cryptocurrency data and handle periodic updates.
- `config.json`: Configuration file that holds the API URL and other settings.

## Permissions

The extension requires the following permissions:

- **`storage`**: To store user configuration settings locally.
- **`tabs`**: To open new tabs and display the detailed crypto page.
- **`activeTab`**: To interact with the active tab if necessary.
- **`<all_urls>`**: To allow fetching data from any URL, necessary for crypto price data API access.

## Crypto API Link
This extension uses the crypto information api from https://coincap.io/

## License

This project is licensed under the MIT License.

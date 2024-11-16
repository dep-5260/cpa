
  document.getElementById("open-crypto").addEventListener("click", () => {
    // Open the crypto.html page in a new tab
    chrome.tabs.create({ url: chrome.runtime.getURL("crypto/crypto.html") });
  });
  
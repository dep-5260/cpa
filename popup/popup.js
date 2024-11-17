document.getElementById("open-crypto").addEventListener("click", () => {
  chrome.tabs.create({ url: chrome.runtime.getURL("crypto/crypto.html") });
});
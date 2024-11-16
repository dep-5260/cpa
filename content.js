let config

chrome.storage.local.get("userConfig", (result) => {
    if (result) {
        config = result.userConfig
        console.log(result.userConfig)
    }
});

async function updatePrice() {
    let btc_stat

    await fetch(config.BTC_URL).then(x=>x.json()).then(n => btc_stat = n)

    function findCoin(symbol) {
        const coin = btc_stat.data.find(coin => coin.symbol === symbol);
        return coin || null;
    };

    let stat = await findCoin("BTC");

    if (stat == null) throw new Error("[Crypto Price Alert]: No data found for the coin, BTC.");

    stat.cpa = {}
    stat.cpa.lastupdated = new Date().getTime()

    chrome.storage.local.set({ cur_btc: stat }, () => {
        console.log("[Crypto Price Alert]: BTC Price Updated");
        console.log(stat);
    });
};
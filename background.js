if (Notification.permission !== "granted") {
    Notification.requestPermission().then(function(permission) {
        if (permission === "granted") {
            console.log("[Crypto Price Alert]: Allowed Notifications_1")
        }
    });
} else {
    console.log("[Crypto Price Alert]: Allowed Notifications_2")
};


async function updatePrice() {
    const url = chrome.runtime.getURL("config.json");
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    let config = await response.json();
    let btc_stat

    await fetch(config.BTC_URL).then(x=>x.json()).then(n => btc_stat = n).catch(err => console.error(err))

    function findCoin(symbol) {
        const coin = btc_stat.data.find(coin => coin.symbol === symbol);
        return coin || null;
    };

    function addCommas(number) {
        // Convert the number to a string if it isn't already
        const numStr = number.toString();
        // Split the string into integer and decimal parts
        const [integerPart, decimalPart] = numStr.split('.');
        
        // Add commas to the integer part using a regular expression
        const integerWithCommas = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        
        // Return the result, combining the integer part with the decimal part if it exists
        return decimalPart ? `${integerWithCommas}.${decimalPart}` : integerWithCommas;
    };

    function formatNumber(value) {
        // Define the thresholds for billion, million, and thousand
        const billion = 1_000_000_000;
        const million = 1_000_000;
        const thousand = 1_000;
    
        let formattedValue;
    
        // Determine the appropriate format based on the value
        if (value >= billion) {
            formattedValue = (value / billion).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' billion';
        } else if (value >= million) {
            formattedValue = (value / million).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' million';
        } else if (value >= thousand) {
            formattedValue = (value / thousand).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' thousand';
        } else {
            formattedValue = value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        }
    
        return formattedValue;
    };

    function calculatePriceChange(initialPrice, finalPrice) {
        // Calculate the absolute change
        const absoluteChange = finalPrice - initialPrice;
        
        // Calculate the percentage change
        const percentageChange = (absoluteChange / initialPrice) * 100;
        
        // Return the results as an object
        return {
            absoluteChange: absoluteChange,
            percentageChange: percentageChange.toFixed(2)  // Format to 2 decimal places
        };
    };

    let stat_btc = await findCoin("BTC");
    let stat_eth = await findCoin("ETH");
    let stat_xrp = await findCoin("XRP");
    let stat = {
        lastupdated: new Date().getTime(),
        data: []
    }

    if (stat_btc == null || stat_eth == null || stat_xrp == null) throw new Error("[Crypto Price Alert]: No data found for the coin, BTC.");

    await stat.data.push(stat_btc)
    await stat.data.push(stat_eth)
    await stat.data.push(stat_xrp)

    await chrome.storage.local.get('cur_stat', function(result) {
        if (result.cur_stat) {
            const stat_bfr = result.cur_stat;
    
            // Use a for...of loop to iterate over data
            for (const data of stat_bfr.data) {
                let h_up = data.priceUsd * 1.02;
                let h_down = data.priceUsd * 0.98;
    
                // Find the coin's updated data in stat.data
                const updatedCoin = stat.data.find(coin => coin.symbol.toLowerCase() === data.symbol.toLowerCase());
    
                if (updatedCoin) {
                    console.log(h_up, h_down, updatedCoin);
    
                    if (updatedCoin.priceUsd > h_up) {
                        chrome.notifications.create({
                            type: 'basic',
                            iconUrl: 'icon.png',
                            title: 'Crypto Price Alert',
                            message: `${data.id} (${data.symbol}) has increased more than 2% in the past 5 minutes. From ${data.priceUsd} to ${updatedCoin.priceUsd}`,
                            priority: 2
                        });
                    } else if (updatedCoin.priceUsd < h_down) {
                        chrome.notifications.create({
                            type: 'basic',
                            iconUrl: 'icon.png',
                            title: 'Crypto Price Alert',
                            message: `${data.id} (${data.symbol}) has decreased more than 2% in the past 5 minutes. From ${data.priceUsd} to ${updatedCoin.priceUsd}`,
                            priority: 2
                        });
                    }
                }
            }
        }
    });

    chrome.storage.local.set({ cur_stat: stat }, () => {
        console.log("[Crypto Price Alert]: Crypto Price Updated");
        console.log(stat);
    });
};

async function updatePriceIDR() {
    const url = chrome.runtime.getURL("config.json"); // fetch config.json
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`); // check
    }

    let config = await response.json();
    let btc_idr_stat

    await fetch(config.BTC_IDR_URL).then(x=>x.json()).then(n => btc_idr_stat = n.ticker).catch(err => console.error(err)); // fetch btc_idr_url api

    btc_idr_stat.lastupdated = new Date().getTime()

    chrome.storage.local.set({ cur_stat_idr: btc_idr_stat }, () => {
        console.log("[Crypto Price Alert]: Crypto BTC IDR Price Updated");
        console.log(btc_idr_stat);
    });
}

chrome.alarms.create("priceCheck", { periodInMinutes: 5 });

updatePrice();
updatePriceIDR();

chrome.alarms.onAlarm.addListener((alarm) => {
    if (alarm.name === "priceCheck") {
      console.log("[Crypto Price Alert]: Updating...");
      updatePrice();
      updatePriceIDR();
    }
});
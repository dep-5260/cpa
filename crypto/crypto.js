// Function to update crypto stats dynamically
function updateCryptoStats(cryptoId, price, high, low, change) {
    const priceElement = document.getElementById(`${cryptoId}-price`);
    const changeElement = document.getElementById(`${cryptoId}-change`);
    const changeValue = parseFloat(change); // Convert change to a number

    // Update text content
    priceElement.textContent = `$${price}`;

    // Determine symbol and color based on percentage change
    if (changeValue < 0) {
        changeElement.textContent = `${change}% ▼`; // Add down arrow for negative change
        changeElement.classList.add('negative');
        changeElement.classList.remove('positive');
        priceElement.classList.add('negative');
        priceElement.classList.remove('positive');
        priceElement.textContent = `$${price} ▼`;
    } else {
        changeElement.textContent = `${change}% ▲`; // Add up arrow for positive change
        changeElement.classList.add('positive');
        changeElement.classList.remove('negative');
        priceElement.classList.add('positive');
        priceElement.classList.remove('negative');
        priceElement.textContent = `$${price} ▲`;
    }
}

function updateIDRCrypto(cryptoId, price, low, high, usd_change) {
    const priceElement = document.getElementById(`${cryptoId}-price`);
    const lowElement = document.getElementById(`${cryptoId}-low`);
    const highElement = document.getElementById(`${cryptoId}-high`);

    lowElement.textContent = `${low}`;
    highElement.textContent = `${price}`;

    if (Number(usd_change) < 0) {
        priceElement.classList.add('negative');
        priceElement.classList.remove('positive');

        priceElement.textContent = `${price} ▼`;
    } else {
        priceElement.classList.add('positive');
        priceElement.classList.remove('negative');

        priceElement.textContent = `${price} ▲`;
    }
}

// Example usage with placeholder data
// updateCryptoStats('btc', '27,000.00', '28,000.00', '26,500.00', '2.5');
// updateCryptoStats('eth', '1,800.00', '1,850.00', '1,750.00', '-1.2');
// updateCryptoStats('xrp', '0.50', '0.55', '0.48', '4.0');

async function fetchAndUpdate() {
    let uc
    chrome.storage.local.get('cur_stat', function(result) {
        if (result.cur_stat) {
            const stat = result.cur_stat;

            const footerTextElement = document.getElementById("footer-text");
            footerTextElement.textContent = `© 2024 Crypto Price Alert. Data last updated on: ${new Date(stat.lastupdated)} from coincap.io and indodax.com`;

            stat.data.forEach(async (data) => {
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
                if (data.symbol.toLowerCase() === "btc") {
                    uc = (Number(data.changePercent24Hr).toFixed(2))
                }
                updateCryptoStats(data.symbol.toLowerCase(), addCommas(Number((data.priceUsd)).toFixed(6)), '28,000.00', '26,500.00', (Number(data.changePercent24Hr).toFixed(2)));
            })
        } else {
            console.log("[Crypto Price Alert]: No current statistics for crypto was found. Contact the developer.")
        }
    })

    chrome.storage.local.get('cur_stat_idr', function(result) {
        if (result.cur_stat_idr) {
            let stat = result.cur_stat_idr;

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

            let output = {};

            output.price = addCommas(Number(stat.buy))
            output.high = addCommas(Number(stat.high))
            output.low = addCommas(Number(stat.low))

            updateIDRCrypto('btc-idr', output.price, output.low, output.high, uc)
        }
    })
}

fetchAndUpdate()
setInterval(function() {
    fetchAndUpdate()
}, (15 * 1000))
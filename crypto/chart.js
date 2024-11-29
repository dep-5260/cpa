document.addEventListener('DOMContentLoaded', function () {
    // Get the width of the .crypto divs
    const cryptoDiv = document.querySelector('.crypto');
    const chartContainer = document.querySelector('.crypto-chart-container');
    if (cryptoDiv && chartContainer) {
        const cryptoWidth = cryptoDiv.offsetWidth;
        chartContainer.style.maxWidth = `${cryptoWidth}px`;
    }

    const ctx = document.getElementById('myLineChart').getContext('2d');
    const myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['7d ago', '6d ago', '5d ago', '4d ago', '3d ago', '2d ago', 'yesterday', 'today'],
            datasets: [{
                label: 'BTC Price',
                data: [0],
                borderColor: 'rgba(250, 150, 10, 1)',
                backgroundColor: 'rgba(250, 150, 10, 0.2)',
                borderWidth: 3,
                tension: 0.1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'bottom',
                }
            },
            scales: {
                x: {
                    title: {
                        display: false,
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Price'
                    },
                    beginAtZero: false
                }
            }
        }
    });

    function updateGraph() {
        chrome.storage.local.get('btcGraph', function(result) {
            if (result.btcGraph) {
                let stat = result.btcGraph;

                myChart.data.labels = stat.labels;
                myChart.data.datasets[0].data = stat.data;
                myChart.update();
            }
        })
    };

    updateGraph()
    setInterval(() => {
        updateGraph()
    }, 5 * (60 * 1000));
});

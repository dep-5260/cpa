document.addEventListener('DOMContentLoaded', function () {
    const ctx = document.getElementById('myLineChart').getContext('2d');
    const myChart = new Chart(ctx, {
        type: 'line', // Chart type
        data: {
            labels: ['7d ago', '6d ago', '5d ago', '4d ago', '3d ago', '2d ago', 'yesterday', 'today'], // X-axis labels
            datasets: [{
                label: 'Price', // Legend label
                data: [0], // Y-axis data
                borderColor: 'rgba(250, 150, 10, 1)',
                backgroundColor: 'rgba(250, 150, 10, 0.2)',
                borderWidth: 3,
                tension: 0.1 // Smooth line
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
                        text: 'Days'
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


    fetch('https://api.coincap.io/v2/assets/bitcoin/history?interval=h12').then(x=>x.json()).then(async (data) => {
        let wData = [];
        await data.data.forEach(async (n) => {
            console.log()
            if (((new Date().getTime() / 1000) - (new Date(n.date).getTime() / 1000)) <= 604800) {
                wData.push(n)
            }
        });

        console.log(wData)

        let d_set = [];
        let d_label = [];

        wData.forEach((n) => {
            let d = new Date(n.time)
            d_set.push(n.priceUsd);
            d_label.push(`${d.getDate()}/${d.getMonth() + 1}/${d.getYear()}`);
        });

        myChart.data.labels = d_label
        myChart.data.datasets[0].data = d_set
        myChart.update();
    })
});

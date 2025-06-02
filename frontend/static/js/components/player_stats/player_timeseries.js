const playerId = document.getElementById("content").dataset.playerId;
initTimeSeries(playerId);

async function initTimeSeries(playerId) {
  const timeSeries = await fetchTimeSeries(playerId);
  renderPointsChart(timeSeries);
}

async function fetchTimeSeries(playerId) {
  const res = await fetch(`/api/player_timeseries/${playerId}`);
  const data = await res.json();
  return data;
}

function renderPointsChart(data) {
  const ctx = document.getElementById("pointsChart").getContext("2d");

  if (window.pointsChartInstance) {
    window.pointsChartInstance.destroy();
  }

  // Convert data to time-based format
  const chartData = data.map((entry) => ({
    x: new Date(entry.Datum),
    y: entry.Punkte,
  }));

  window.pointsChartInstance = new Chart(ctx, {
    type: "line",
    data: {
      datasets: [
        {
          data: chartData,
          borderColor: "#4b35d7",
          borderWidth: 2,
          pointRadius: 3,
          fill: false,
          tension: 0.2,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: false },
        title: { display: false },
      },
      scales: {
        x: {
          type: "time",
          time: {
            unit: "month",
            tooltipFormat: "MMM yyyy",
            displayFormats: {
              month: "MMM yy",
            },
          },
          grid: {
            display: true,
            drawOnChartArea: false,
          },
        },
        y: {
          beginAtZero: false,
          suggestedMin: Math.min(...data.map((e) => e.Punkte)) - 5,
          suggestedMax: Math.max(...data.map((e) => e.Punkte)) + 5,
          ticks: {
            callback: (value) => value.toFixed(1),
          },
          grid: {
            color: (ctx) => (ctx.tick.value === 0 ? "#000" : "rgba(0,0,0,0.1)"),
            lineWidth: (ctx) => (ctx.tick.value === 0 ? 2 : 1),
          },
        },
      },
    },
  });
}

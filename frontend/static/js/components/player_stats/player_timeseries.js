initTimeSeries(playerInfo.id);

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

  // Format the labels as 'Mon YY'
  const formattedLabels = data.map((entry) => {
    const date = new Date(entry.Datum);
    return date.toLocaleDateString("en-US", {
      month: "short",
      year: "2-digit",
    });
  });

  window.pointsChartInstance = new Chart(ctx, {
    type: "line",
    data: {
      labels: formattedLabels,
      datasets: [
        {
          data: data.map((entry) => entry.Punkte),
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
          ticks: {
            autoSkip: true,
            maxTicksLimit: 10,
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

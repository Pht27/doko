document.addEventListener("DOMContentLoaded", () => {
  initTabs();
});

async function initTabs() {
  const playerId = document.getElementById("content").dataset.playerId;

  initTabContent();

  const specialCardsStats = await fetchSpecialCardsStats(playerId);
  initSpecialCardsStats(specialCardsStats);

  const extraPointsStats = await fetchExtraPointsStats(playerId);
  initExtraPointsStats(extraPointsStats);
}

function initTabContent() {
  const specialCardsRadio = document.getElementById("tab-special-cards");
  specialCardsRadio.checked = true;
}

function initSpecialCardsStats(specialCardsStats) {
  renderSpecialCardsTable(specialCardsStats);
}

function initExtraPointsStats(extraPointsStats) {
  renderExtraPointsTable(extraPointsStats);
}

function updateTabContent() {
  // Hide all tab contents
  document.querySelectorAll(".tab-content").forEach((tab) => {
    tab.classList.remove("show");
  });

  // Get radio buttons
  const specialCardsRadio = document.getElementById("tab-special-cards");
  const extraPointsRadio = document.getElementById("tab-extra-points");
  const teamStatsRadio = document.getElementById("tab-team-partners");
  const statsAloneRadio = document.getElementById("tab-stats-alone");

  // Show the corresponding tab content
  if (specialCardsRadio.checked) {
    document.getElementById("content-special-cards").classList.add("show");
  } else if (extraPointsRadio.checked) {
    document.getElementById("content-extra-points").classList.add("show");
  } else if (teamStatsRadio.checked) {
    document.getElementById("content-team-partners").classList.add("show");
  } else if (statsAloneRadio.checked) {
    document.getElementById("content-stats-alone").classList.add("show");
  }
}
function renderSpecialCardsTable(data) {
  const table = document.getElementById("specialCardsTable");

  // Create header
  const headerRow = document.createElement("tr");
  const headers = ["Karte", "Gespielt", "Winrate", "Ø Spielwert"];

  headers.forEach((headerText) => {
    const th = document.createElement("th");
    th.textContent = headerText;
    headerRow.appendChild(th);
  });

  table.appendChild(headerRow);

  // Create rows
  data.forEach((entry) => {
    const row = document.createElement("tr");

    const values = [
      entry.special_card_name,
      entry.games_with_special_card,
      `${(parseFloat(entry.winrate) * 100).toFixed(1)}%`,
      entry.mean_game_value,
    ];

    values.forEach((val) => {
      const td = document.createElement("td");
      td.textContent = val;
      row.appendChild(td);
    });

    table.appendChild(row);
  });
}
function renderExtraPointsTable(data) {
  const table = document.getElementById("extraPointsTable");

  // Create header
  const headerRow = document.createElement("tr");
  const headers = ["Punkt", "Anzahl", "Winrate", "Ø Spielwert"];

  headers.forEach((headerText) => {
    const th = document.createElement("th");
    th.textContent = headerText;
    headerRow.appendChild(th);
  });

  table.appendChild(headerRow);

  // Create rows
  data.forEach((entry) => {
    const row = document.createElement("tr");

    const values = [
      entry.extra_point_name,
      entry.extra_point_count,
      `${(parseFloat(entry.winrate) * 100).toFixed(1)}%`,
      entry.mean_game_value,
    ];

    values.forEach((val) => {
      const td = document.createElement("td");
      td.textContent = val;
      row.appendChild(td);
    });

    table.appendChild(row);
  });
}

async function fetchSpecialCardsStats(playerId) {
  const res = await fetch(`/api/player_special_cards_stats/${playerId}`);
  const data = await res.json();
  return data;
}
async function fetchExtraPointsStats(playerId) {
  const res = await fetch(`/api/player_extra_points_stats/${playerId}`);
  const data = await res.json();
  return data;
}

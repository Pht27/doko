document.addEventListener("DOMContentLoaded", () => {
  initTabs();
});

// INITS

async function initTabs() {
  const playerId = document.getElementById("content").dataset.playerId;

  initTabContent();

  const specialCardsStats = await fetchSpecialCardsStats(playerId);
  initSpecialCardsStats(specialCardsStats);

  const extraPointsStats = await fetchExtraPointsStats(playerId);
  initExtraPointsStats(extraPointsStats);

  const partnerStats = await fetchPartnerStats(playerId);
  initPartnerStats(partnerStats);

  const aloneStats = await fetchAloneStats(playerId);
  initAloneStats(aloneStats);
}

function initTabContent() {
  const gameModeRadio = document.getElementById("tab-game-modes");
  gameModeRadio.checked = true;
}

function initSpecialCardsStats(specialCardsStats) {
  renderSpecialCardsTable(specialCardsStats);
}

function initExtraPointsStats(extraPointsStats) {
  renderExtraPointsTable(extraPointsStats);
}

function initPartnerStats(partnerStats) {
  renderPartnerTable(partnerStats);
}

function initAloneStats(aloneStats) {
  console.log(aloneStats);
  renderAloneTable(aloneStats);
}

// VISUALS

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
function renderPartnerTable(data) {
  // Sort by mean_game_value descending
  data.sort(
    (a, b) => parseFloat(b.mean_game_value) - parseFloat(a.mean_game_value)
  );

  const table = document.getElementById("partnerTable");

  // Table Header
  const thead = document.createElement("thead");
  thead.innerHTML = `
    <tr>
      <th>Partner</th>
      <th>Spiele</th>
      <th>Winrate</th>
      <th>Ø Spielwert</th>
    </tr>
  `;
  table.appendChild(thead);

  // Table Body
  const tbody = document.createElement("tbody");
  data.forEach((entry) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${entry.name}</td>
      <td>${entry.games_played}</td>
      <td>${(parseFloat(entry.winrate) * 100).toFixed(1)}%</td>
      <td>${parseFloat(entry.mean_game_value).toFixed(2)}</td>
    `;
    tbody.appendChild(tr);
  });
  table.appendChild(tbody);
}
function renderAloneTable(data) {
  const table = document.getElementById("aloneTable");

  // Table Header
  const thead = document.createElement("thead");
  thead.innerHTML = `
    <tr>
      <th></th>
      <th></th>
    </tr>
  `;
  table.appendChild(thead);

  // Table Body
  const tableBody = document.createElement("tbody");

  function addRow(label, value) {
    const row = document.createElement("tr");
    const keyCell = document.createElement("td");
    const valueCell = document.createElement("td");

    keyCell.classList.add("stat");

    keyCell.textContent = label + ":";
    valueCell.textContent = value;

    row.appendChild(keyCell);
    row.appendChild(valueCell);
    tableBody.appendChild(row);
  }

  addRow("Spiele allein gespielt", data["Spiele Gespielt"]);
  addRow("Winrate allein", data["Winrate"]);
  addRow("Mittlerer Spielwert allein", data["Mittlerer Spielwert"]);
  addRow("Solos allein gespielt", data["Solos gespielt"]);
  addRow("Solos allein gewonnen", data["Solos gewonnen"]);
  addRow("Mittlerer Solo Spielwert allein", data["Mittlerer Solo Spielwert"]);

  table.appendChild(tableBody);
}

// API CALLS

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
async function fetchPartnerStats(playerId) {
  const res = await fetch(`/api/player_partner_stats/${playerId}`);
  const data = await res.json();
  return data;
}
async function fetchAloneStats(playerId) {
  const res = await fetch(`/api/player_alone_stats/${playerId}`);
  const data = await res.json();
  return data;
}

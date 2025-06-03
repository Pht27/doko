document.addEventListener("DOMContentLoaded", () => {
  initTabs();
});

// INITS

async function initTabs() {
  const playerId = document.getElementById("content").dataset.playerId;

  initTabContent();

  const gameModeStats = await fetchGameModeStats(playerId);
  initGameModeStats(gameModeStats);

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

  const teamStatsRadio = document.getElementById("tab-team-partners");
  teamStatsRadio.checked = true;
}

function initGameModeStats(gameModeStats) {
  renderGameModeStatsTable(gameModeStats);
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
  renderAloneTable(aloneStats);
}

// VISUALS

function updateTabContent() {
  // Hide all tab contents
  document.querySelectorAll(".tab-content").forEach((tab) => {
    tab.classList.remove("show");
  });

  // Get radio buttons
  const gameModeRadio = document.getElementById("tab-game-modes");
  const specialCardsRadio = document.getElementById("tab-special-cards");
  const extraPointsRadio = document.getElementById("tab-extra-points");
  const teamStatsRadio = document.getElementById("tab-team-partners");
  const statsAloneRadio = document.getElementById("tab-stats-alone");

  // Show the corresponding tab content
  if (specialCardsRadio.checked) {
    document.getElementById("content-special-cards").classList.add("show");
  } else if (extraPointsRadio.checked) {
    document.getElementById("content-extra-points").classList.add("show");
  } else if (gameModeRadio.checked) {
    document.getElementById("content-game-mode").classList.add("show");
  }

  if (teamStatsRadio.checked) {
    document.getElementById("content-team-partners").classList.add("show");
  } else if (statsAloneRadio.checked) {
    document.getElementById("content-stats-alone").classList.add("show");
  }
}

function renderGameModeStatsTable(data) {
  const table = document.getElementById("gameModeTable");

  // Create header
  const headerRow = document.createElement("tr");
  const headers = [
    "Spielmodus",
    "Gespielt (R/K)",
    "Winrate (R/K)",
    "Ø Spielwert (R/K)",
  ];

  headers.forEach((headerText) => {
    const th = document.createElement("th");
    th.textContent = headerText;
    headerRow.appendChild(th);
  });

  table.appendChild(headerRow);

  data.forEach((row) => {
    const tr = document.createElement("tr");

    // Played string
    const playedStr = `${row.played.Re} / ${row.played.Kontra}`;

    // --- Winrate cell ---
    const winrateCell = document.createElement("td");

    const reWRSpan = document.createElement("span");
    const reWR = row.winrate.Re;
    reWRSpan.textContent = reWR !== null ? (reWR * 100).toFixed(1) + "%" : "-";
    if (reWR !== null) reWRSpan.style.color = getColorForPercentage(reWR);

    const slash1 = document.createTextNode(" / ");

    const koWRSpan = document.createElement("span");
    const koWR = row.winrate.Kontra;
    koWRSpan.textContent = koWR !== null ? (koWR * 100).toFixed(1) + "%" : "-";
    if (koWR !== null) koWRSpan.style.color = getColorForPercentage(koWR);

    winrateCell.appendChild(reWRSpan);
    winrateCell.appendChild(slash1);
    winrateCell.appendChild(koWRSpan);

    // --- Mean Points cell ---
    const meanCell = document.createElement("td");

    const reMeanSpan = document.createElement("span");
    const reMean = row.mean_game_value.Re;
    reMeanSpan.textContent = reMean !== null ? reMean.toFixed(2) : "-";
    if (reMean !== null) reMeanSpan.style.color = getColorForMeanPoints(reMean);

    const slash2 = document.createTextNode(" / ");

    const koMeanSpan = document.createElement("span");
    const koMean = row.mean_game_value.Kontra;
    koMeanSpan.textContent = koMean !== null ? koMean.toFixed(2) : "-";
    if (koMean !== null) koMeanSpan.style.color = getColorForMeanPoints(koMean);

    meanCell.appendChild(reMeanSpan);
    meanCell.appendChild(slash2);
    meanCell.appendChild(koMeanSpan);

    // Combine all into row
    tr.innerHTML = `
      <td>${row.game_mode_name}</td>
      <td>${playedStr}</td>
    `;
    tr.appendChild(winrateCell);
    tr.appendChild(meanCell);

    table.appendChild(tr);
  });

  makeTableSortable(table);
}
function renderSpecialCardsTable(data) {
  const table = document.getElementById("specialCardsTable");

  const headerRow = document.createElement("tr");
  ["Karte", "Anzahl", "Winrate", "Ø Spielwert"].forEach((text) => {
    const th = document.createElement("th");
    th.textContent = text;
    headerRow.appendChild(th);
  });
  table.appendChild(headerRow);

  data.forEach((row) => {
    const tr = document.createElement("tr");

    const winrate = parseFloat(row.winrate);
    const mean = parseFloat(row.mean_game_value);

    const wrSpan = document.createElement("span");
    wrSpan.textContent = !isNaN(winrate)
      ? (winrate * 100).toFixed(1) + "%"
      : "-";
    if (!isNaN(winrate)) wrSpan.style.color = getColorForPercentage(winrate);

    const meanSpan = document.createElement("span");
    meanSpan.textContent = !isNaN(mean) ? mean.toFixed(2) : "-";
    if (!isNaN(mean)) meanSpan.style.color = getColorForMeanPoints(mean);

    tr.innerHTML = `
      <td>${row.special_card_name}</td>
      <td>${row.games_with_special_card}</td>
    `;

    const wrTd = document.createElement("td");
    wrTd.appendChild(wrSpan);

    const meanTd = document.createElement("td");
    meanTd.appendChild(meanSpan);

    tr.appendChild(wrTd);
    tr.appendChild(meanTd);

    table.appendChild(tr);
  });

  makeTableSortable(table);
}
function renderExtraPointsTable(data) {
  const table = document.getElementById("extraPointsTable");

  const headerRow = document.createElement("tr");
  ["Extrapunkt", "Anzahl", "Winrate", "Ø Spielwert"].forEach((text) => {
    const th = document.createElement("th");
    th.textContent = text;
    headerRow.appendChild(th);
  });
  table.appendChild(headerRow);

  data.forEach((row) => {
    const tr = document.createElement("tr");

    const winrate = parseFloat(row.winrate);
    const mean = parseFloat(row.mean_game_value);

    const wrSpan = document.createElement("span");
    wrSpan.textContent = !isNaN(winrate)
      ? (winrate * 100).toFixed(1) + "%"
      : "-";
    if (!isNaN(winrate)) wrSpan.style.color = getColorForPercentage(winrate);

    const meanSpan = document.createElement("span");
    meanSpan.textContent = !isNaN(mean) ? mean.toFixed(2) : "-";
    if (!isNaN(mean)) meanSpan.style.color = getColorForMeanPoints(mean);

    tr.innerHTML = `
      <td>${row.extra_point_name}</td>
      <td>${row.extra_point_count}</td>
    `;

    const wrTd = document.createElement("td");
    wrTd.appendChild(wrSpan);

    const meanTd = document.createElement("td");
    meanTd.appendChild(meanSpan);

    tr.appendChild(wrTd);
    tr.appendChild(meanTd);

    table.appendChild(tr);
  });

  makeTableSortable(table);
}
function renderPartnerTable(data) {
  const table = document.getElementById("partnerTable");

  const headerRow = document.createElement("tr");
  ["Partner", "Spiele", "Winrate", "Ø Spielwert"].forEach((text) => {
    const th = document.createElement("th");
    th.textContent = text;
    headerRow.appendChild(th);
  });
  table.appendChild(headerRow);

  // Sort by mean_game_value descending (highest first)
  data.sort((a, b) => {
    const aVal = parseFloat(a.mean_game_value);
    const bVal = parseFloat(b.mean_game_value);
    return isNaN(bVal) - isNaN(aVal) || bVal - aVal;
  });

  data.forEach((row) => {
    const tr = document.createElement("tr");

    const winrate = parseFloat(row.winrate);
    const mean = parseFloat(row.mean_game_value);

    const wrSpan = document.createElement("span");
    wrSpan.textContent = !isNaN(winrate)
      ? (winrate * 100).toFixed(1) + "%"
      : "-";
    if (!isNaN(winrate)) wrSpan.style.color = getColorForPercentage(winrate);

    const meanSpan = document.createElement("span");
    meanSpan.textContent = !isNaN(mean) ? mean.toFixed(2) : "-";
    if (!isNaN(mean)) meanSpan.style.color = getColorForMeanPoints(mean);

    tr.innerHTML = `
      <td>${row.name}</td>
      <td>${row.games_played}</td>
    `;

    const wrTd = document.createElement("td");
    wrTd.appendChild(wrSpan);

    const meanTd = document.createElement("td");
    meanTd.appendChild(meanSpan);

    tr.appendChild(wrTd);
    tr.appendChild(meanTd);

    table.appendChild(tr);
  });

  makeTableSortable(table);
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

  function addRow(label, value, color = null) {
    const row = document.createElement("tr");
    const keyCell = document.createElement("td");
    const valueCell = document.createElement("td");

    keyCell.classList.add("stat");

    keyCell.textContent = label + ":";
    valueCell.textContent = value;

    if (color) {
      valueCell.style.color = color;
    }

    row.appendChild(keyCell);
    row.appendChild(valueCell);
    tableBody.appendChild(row);
  }

  addRow("Spiele allein gespielt", data["Spiele Gespielt"]);
  addRow(
    "Winrate allein",
    data["Winrate"],
    (color = getColorForPercentage(parseFloat(data["Winrate"]) / 100))
  );
  addRow(
    "Mittlerer Spielwert allein",
    data["Mittlerer Spielwert"],
    (color = getColorForMeanPoints(parseFloat(data["Mittlerer Spielwert"])))
  );
  addRow("Solos allein gespielt", data["Solos gespielt"]);
  addRow("Solos allein gewonnen", data["Solos gewonnen"]);
  addRow(
    "Mittlerer Solo Spielwert allein",
    data["Mittlerer Solo Spielwert"],
    (color = getColorForMeanPoints(
      parseFloat(data["Mittlerer Solo Spielwert"])
    ))
  );

  table.appendChild(tableBody);
}

// API CALLS
async function fetchGameModeStats(playerId) {
  const res = await fetch(`/api/player_game_modes_stats/${playerId}`);
  const data = await res.json();
  return data;
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

// UTILS

function getColorForPercentage(pct) {
  const startColor = { r: 153, g: 0, b: 0 };
  const midColor = { r: 153, g: 153, b: 0 };
  const endColor = { r: 0, g: 153, b: 0 };

  let color;
  if (pct < 0.5) {
    const factor = pct * 2;
    color = {
      r: Math.round(startColor.r + factor * (midColor.r - startColor.r)),
      g: Math.round(startColor.g + factor * (midColor.g - startColor.g)),
      b: Math.round(startColor.b + factor * (midColor.b - startColor.b)),
    };
  } else {
    const factor = (pct - 0.5) * 2;
    color = {
      r: Math.round(midColor.r + factor * (endColor.r - midColor.r)),
      g: Math.round(midColor.g + factor * (endColor.g - midColor.g)),
      b: Math.round(midColor.b + factor * (endColor.b - midColor.b)),
    };
  }

  return `rgb(${color.r}, ${color.g}, ${color.b})`;
}

function getColorForMeanPoints(meanPoints) {
  const clamped = Math.max(-2, Math.min(2, meanPoints));
  const pct = (clamped + 2) / 4;
  return getColorForPercentage(pct);
}

function getColorForTotalPoints(totalPoints) {
  const clamped = Math.max(-150, Math.min(150, totalPoints));
  const pct = (clamped + 150) / 300;
  return getColorForPercentage(pct);
}

function makeTableSortable(table) {
  const headers = table.querySelectorAll("th");

  headers.forEach((header, index) => {
    header.style.cursor = "pointer";

    let ascending = true;

    header.addEventListener("click", () => {
      const rows = Array.from(table.querySelectorAll("tr:nth-child(n+2)")); // Skip header
      rows.sort((a, b) => {
        const cellA = a.children[index].textContent.trim();
        const cellB = b.children[index].textContent.trim();

        const valA = parseFloat(cellA.replace(",", ".")) || cellA.toLowerCase();
        const valB = parseFloat(cellB.replace(",", ".")) || cellB.toLowerCase();

        if (valA < valB) return ascending ? -1 : 1;
        if (valA > valB) return ascending ? 1 : -1;
        return 0;
      });

      ascending = !ascending;

      rows.forEach((row) => table.appendChild(row)); // Re-append in new order
    });
  });
}

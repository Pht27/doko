document.addEventListener("DOMContentLoaded", () => {
  init();
});

// INITS

async function init() {
  const gameModeStats = await fetchGameModeStats();
  initGameModeStats(gameModeStats);

  const specialCardsStats = await fetchSpecialCardsStats();
  initSpecialCardsStats(specialCardsStats);

  const extraPointsStats = await fetchExtraPointsStats();
  initExtraPointsStats(extraPointsStats);
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

// VISUALS

function renderGameModeStatsTable(data) {
  const table = document.getElementById("gameModeTable");
  table.innerHTML = ""; // Clear existing content

  // Create header row
  const headerRow = document.createElement("tr");
  ["Spielmodus", "Anzahl", "Winrate (R)", "Ø Spielwert (R)"].forEach((text) => {
    const th = document.createElement("th");
    th.textContent = text;
    headerRow.appendChild(th);
  });
  table.appendChild(headerRow);

  // Populate data rows
  data.forEach((row) => {
    const tr = document.createElement("tr");

    const nameCell = document.createElement("td");
    nameCell.textContent = row.game_mode_name;
    tr.appendChild(nameCell);

    const countCell = document.createElement("td");
    countCell.textContent = row.game_mode_count;
    countCell.style.fontWeight = "bold";
    tr.appendChild(countCell);

    const winrateCell = document.createElement("td");
    if (row.re_winrate) {
      winrateCell.textContent = `${(parseFloat(row.re_winrate) * 100).toFixed(
        1
      )}%`;
      winrateCell.style.color = getColorForPercentage(row.re_winrate);
    } else {
      winrateCell.textContent = "-";
    }
    tr.appendChild(winrateCell);

    const meanValueCell = document.createElement("td");
    if (row.re_mean_points) {
      meanValueCell.textContent = parseFloat(row.re_mean_points).toFixed(2);
      meanValueCell.style.color = getColorForMeanPoints(row.re_mean_points);
    } else {
      meanValueCell.textContent = "-";
    }
    tr.appendChild(meanValueCell);

    table.appendChild(tr);
  });

  makeTableSortable(table);
}

function renderSpecialCardsTable(data) {
  const table = document.getElementById("specialCardsTable");
  table.innerHTML = ""; // Clear existing content

  // Create header row
  const headerRow = document.createElement("tr");
  ["Karte", "Anzahl", "Winrate", "Ø Spielwert"].forEach((text) => {
    const th = document.createElement("th");
    th.textContent = text;
    headerRow.appendChild(th);
  });
  table.appendChild(headerRow);

  // Populate data rows
  data.forEach((row) => {
    const tr = document.createElement("tr");

    const nameCell = document.createElement("td");
    nameCell.textContent = row.special_card_name;
    tr.appendChild(nameCell);

    const countCell = document.createElement("td");
    countCell.textContent = row.special_card_count;
    countCell.style.fontWeight = "bold";
    tr.appendChild(countCell);

    const winrateCell = document.createElement("td");
    if (row.winrate) {
      winrateCell.textContent = `${(parseFloat(row.winrate) * 100).toFixed(
        1
      )}%`;
      winrateCell.style.color = getColorForPercentage(row.winrate);
    } else {
      winrateCell.textContent = "-";
    }
    tr.appendChild(winrateCell);

    const meanValueCell = document.createElement("td");
    if (row.mean_game_value) {
      meanValueCell.textContent = row.mean_game_value;
      meanValueCell.style.color = getColorForMeanPoints(row.mean_game_value);
    } else {
      meanValueCell.textContent = "-";
    }
    tr.appendChild(meanValueCell);

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
  // Populate data rows
  data.forEach((row) => {
    const tr = document.createElement("tr");

    const nameCell = document.createElement("td");
    nameCell.textContent = row.extra_point_name;
    tr.appendChild(nameCell);

    const countCell = document.createElement("td");
    countCell.textContent = row.extra_point_count;
    countCell.style.fontWeight = "bold";
    tr.appendChild(countCell);

    const winrateCell = document.createElement("td");
    if (row.winrate) {
      winrateCell.textContent = `${(parseFloat(row.winrate) * 100).toFixed(
        1
      )}%`;
      winrateCell.style.color = getColorForPercentage(row.winrate);
    } else {
      winrateCell.textContent = "-";
    }
    tr.appendChild(winrateCell);

    const meanValueCell = document.createElement("td");
    if (row.mean_game_value) {
      meanValueCell.textContent = row.mean_game_value;
      meanValueCell.style.color = getColorForMeanPoints(row.mean_game_value);
    } else {
      meanValueCell.textContent = "-";
    }
    tr.appendChild(meanValueCell);

    table.appendChild(tr);
  });

  makeTableSortable(table);
}

// API CALLS
async function fetchGameModeStats() {
  const res = await fetch(`/api/game_mode_stats`);
  const data = await res.json();
  return data;
}
async function fetchSpecialCardsStats() {
  const res = await fetch(`/api/special_card_stats`);
  const data = await res.json();
  return data;
}
async function fetchExtraPointsStats() {
  const res = await fetch(`/api/extra_point_stats`);
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

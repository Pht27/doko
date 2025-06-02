document.addEventListener("DOMContentLoaded", () => {
  init();
});

let playerInfo;

async function init() {
  const playerId = document.getElementById("content").dataset.playerId;
  playerInfo = await fetchPlayerInfo(playerId);
  const baseStats = await fetchBaseStats(playerId);

  initPlayerName(playerInfo.name);
  initProfilePicture(playerInfo.picture_name);
  initActivityBar(playerInfo.active);
  initPlayerBaseStats(baseStats);
  initTimeSeries(playerInfo.id);
}

async function initProfilePicture(pictureName) {
  if (!pictureName) {
    return;
  }
  fetch(`/api/get_card_by_name?name=${pictureName}`)
    .then((response) => {
      if (!response.ok) throw new Error("SVG not found");
      return response.text();
    })
    .then((svg) => {
      document.getElementById("profileCard").innerHTML = svg;
    })
    .catch((err) => {
      console.error("Failed to load card:", err);
    });
}
function initPlayerName(name) {
  document.querySelector(".player-name").innerHTML = name;
}
function initActivityBar(isActive) {
  initDeactivateButton(isActive);

  let activityBar = document.querySelector(".activity-bar");
  let activityStatus = document.getElementById("activityStatus");
  let activityTitle = document.querySelector(".activity-title");

  if (isActive) {
    activityBar.classList.add("active");
    activityStatus.classList.add("active");
    activityTitle.classList.add("active");
    activityStatus.innerHTML = "Aktiv";
  } else {
    activityBar.classList.remove("active");
    activityStatus.classList.remove("active");
    activityTitle.classList.remove("active");
    activityStatus.innerHTML = "Inaktiv";
  }
}
function initDeactivateButton(isActive) {
  const toggle = document.getElementById("activityToggle");

  toggle.checked = isActive === 1;
}
function initPlayerBaseStats(baseStats) {
  let tableBody = document.getElementById("player-base-stats-table-body");

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

  addRow(
    "Punkte",
    baseStats["Punkte"],
    (color = getColorForTotalPoints(parseFloat(baseStats["Punkte"])))
  );
  addRow("Spiele Gespielt", baseStats["Spiele Gespielt"]);
  addRow(
    "Winrate",
    baseStats["Winrate"],
    (color = getColorForPercentage(parseFloat(baseStats["Winrate"])))
  );
  addRow(
    "Mittlere Punkte",
    baseStats["Mittlere Punkte"],
    (color = getColorForMeanPoints(parseFloat(baseStats["Mittlere Punkte"])))
  );
  addRow("Solos gespielt", baseStats["Solos gespielt"]);
  addRow("Solos gewonnen", baseStats["Solos gewonnen"]);
  addRow(
    "Mittlere Solo Punkte",
    baseStats["Mittlere Solo Punkte"],
    (color = getColorForMeanPoints(
      parseFloat(baseStats["Mittlere Solo Punkte"])
    ))
  );
}

async function fetchPlayerInfo(playerId) {
  const res = await fetch(`/api/player_info/${playerId}`);
  const data = await res.json();
  return data;
}
async function fetchBaseStats(playerId) {
  const res = await fetch(`/api/player_base_stats/${playerId}`);
  const data = await res.json();
  return data;
}
async function fetchProfilePicture(pictureName) {}

function updateActivityStatus() {
  const toggle = document.getElementById("activityToggle");

  const isActive = toggle.checked ? 1 : 0;
  playerInfo.active = isActive;

  // Optional: update any other visual parts
  initActivityBar(isActive);

  fetch("/api/set_activity_status", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      player_id: playerInfo.id,
      active: isActive,
    }),
  })
    .then((res) => {
      if (!res.ok) throw new Error("Failed to update activity status");
      return res.json();
    })
    .catch((err) => {
      console.error("Error:", err);
    });
}

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
  const clamped = Math.max(-150, Math.min(150, meanPoints));
  const pct = (clamped + 150) / 300;
  return getColorForPercentage(pct);
}

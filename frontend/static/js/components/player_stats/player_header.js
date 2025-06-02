document.addEventListener("DOMContentLoaded", () => {
  init();
});

function init() {
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

  addRow("Spiele Gespielt", baseStats["Spiele Gespielt"]);
  addRow("Siege", baseStats["Siege"]);
  addRow("Winrate", baseStats["Winrate"]);
  addRow("Mittlere Punkte", baseStats["Mittlere Punkte"]);
  addRow("Solos gespielt", baseStats["Solos gespielt"]);
  addRow("Solos gewonnen", baseStats["Solos gewonnen"]);
  addRow("Mittlere Solo Punkte", baseStats["Mittlere Solo Punkte"]);
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

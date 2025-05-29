let currentEditTeamIndex = null;

//
// ─── MODAL CONTROL ──────────────────────────────────────────────────────────────
//

function openTeamEditor(teamIndex) {
  currentEditTeamIndex = teamIndex;

  const modal = document.getElementById("team-editor-modal");
  modal.classList.remove("modal--hidden");
  document.body.classList.add("modal-open");

  // Ensure back button works
  if (!location.hash.includes("modal")) {
    location.hash = "#modal";
  }

  fillModal(teamIndex);
}

function closeTeamEditor() {
  currentEditTeamIndex = null;

  document.getElementById("team-editor-modal").classList.add("modal--hidden");
  document.body.classList.remove("modal-open");

  if (location.hash === "#modal") {
    history.back();
  }

  updateTeamBlocks();

  // Reset UI
  hideElement("extra-point-selector");
  hideElement("special-card-selector");
  hideElement("player-search-results");
  document.getElementById("player-search").value = "";
}

window.addEventListener("hashchange", () => {
  if (location.hash !== "#modal") closeTeamEditor();
});

//
// ─── UI HELPERS ────────────────────────────────────────────────────────────────
//

function hideElement(id) {
  document.getElementById(id).classList.add("hidden");
}

function toggleSelector(id, html) {
  const el = document.getElementById(id);
  el.classList.toggle("hidden");
  el.innerHTML = html;
}

function isPlayerAlreadyAdded(idToCheck) {
  return Object.values(roundData.teams).some((team) =>
    team.player_ids.includes(idToCheck)
  );
}

//
// ─── SELECTOR HANDLERS ─────────────────────────────────────────────────────────
//

function specialCardButtonHandleClick(event) {
  event.stopPropagation();
  const html = allSpecialCards
    .filter(
      (card) =>
        !roundData.teams[currentEditTeamIndex].special_cards.includes(card.name)
    )
    .map(
      (card) =>
        `<div class="selector-item" onclick="addSpecialCard('${card.name}')">${card.name}</div>`
    )
    .join("");
  toggleSelector("special-card-selector", html);
}

function extraPointButtonHandleClick(event) {
  event.stopPropagation();
  const html = allExtraPoints
    .filter(
      (point) =>
        !Object.keys(
          roundData.teams[currentEditTeamIndex].extra_points
        ).includes(point.name)
    )
    .map(
      (point) =>
        `<div class="selector-item" onclick="addExtraPoint('${point.name}')">${point.name}</div>`
    )
    .join("");
  toggleSelector("extra-point-selector", html);
}

function playerSearchHandleInput(e) {
  const query = e.target.value.toLowerCase();
  let results = allPlayers
    .filter((p) => !isPlayerAlreadyAdded(p.id))
    .filter((p) => p.name.toLowerCase().startsWith(query))
    .map(
      (p) =>
        `<div class="search-item" onclick="addPlayer(${p.id})">${p.name}</div>`
    )
    .join("");

  if (!results) results = "Keine Übereinstimmungen";
  document.getElementById("player-search-results").innerHTML = results;
  document.getElementById("player-search-results").classList.remove("hidden");
}

//
// ─── DATA MODIFICATION ─────────────────────────────────────────────────────────
//

function addSpecialCard(card) {
  roundData.teams[currentEditTeamIndex].special_cards.push(card);
  hideElement("special-card-selector");
  fillModal(currentEditTeamIndex);
}

function addExtraPoint(point) {
  roundData.teams[currentEditTeamIndex].extra_points[point] = 1;
  hideElement("extra-point-selector");
  fillModal(currentEditTeamIndex);
}

function addPlayer(playerId) {
  roundData.teams[currentEditTeamIndex].player_ids.push(playerId);
  hideElement("player-search-results");
  document.getElementById("player-search").value = "";
  fillModal(currentEditTeamIndex);
}

function removePlayer(teamIndex, playerIdx, event) {
  event.stopPropagation();
  roundData.teams[teamIndex].player_ids.splice(playerIdx, 1);
  fillModal(teamIndex);
}

function removeSpecialCard(teamIndex, cardIdx, event) {
  event.stopPropagation();
  roundData.teams[teamIndex].special_cards.splice(cardIdx, 1);
  openTeamEditor(teamIndex);
}

function removeExtraPoint(teamIndex, key, event) {
  event.stopPropagation();
  delete roundData.teams[teamIndex].extra_points[key];
  openTeamEditor(teamIndex);
}

function changeExtraPoint(teamIndex, point, delta, event) {
  event.stopPropagation();
  const team = roundData.teams[teamIndex];
  const current = team.extra_points[point];
  const newValue = current + delta;
  if (newValue < 1) return;
  team.extra_points[point] = newValue;
  fillModal(currentEditTeamIndex);
}

//
// ─── RENDER MODAL CONTENT ──────────────────────────────────────────────────────
//

function fillModal(teamIndex) {
  const team = roundData.teams[teamIndex];

  // Players
  const playersList = document.getElementById("team-players-list");
  playersList.innerHTML = "";

  teamName = getTeamNameFromPlayerIds(team.player_ids);

  if (teamName) {
    teamName.split(", ").forEach((name, idx) => {
      playersList.innerHTML += `<li>${name} <button class="remove-btn" onclick="removePlayer(${teamIndex}, ${idx}, event)">✖</button></li>`;
    });
  }

  // Special Cards
  const specialList = document.getElementById("team-special-list");
  specialList.innerHTML = "";
  (team.special_cards || []).forEach((card, idx) => {
    specialList.innerHTML += `<li>${card} <button class="remove-btn" onclick="removeSpecialCard(${teamIndex}, ${idx}, event)">✖</button></li>`;
  });

  // Extra Points
  const extraList = document.getElementById("team-extra-list");
  extraList.innerHTML = "";
  renderExtraPoints(team, teamIndex).forEach((li) => extraList.appendChild(li));
}

function renderExtraPoints(team, teamIndex) {
  return Object.entries(team.extra_points || {}).map(([key, val]) => {
    const li = document.createElement("li");
    li.classList.add("point-item");

    const nameSpan = document.createElement("span");
    nameSpan.classList.add("point-name");
    nameSpan.textContent = key;

    const controlsDiv = document.createElement("div");
    controlsDiv.classList.add("point-controls");

    const minusBtn = document.createElement("button");
    minusBtn.textContent = "−";
    minusBtn.onclick = (e) => changeExtraPoint(teamIndex, key, -1, e);

    const countSpan = document.createElement("span");
    countSpan.classList.add("point-value");
    countSpan.textContent = val;

    const plusBtn = document.createElement("button");
    plusBtn.textContent = "+";
    plusBtn.onclick = (e) => changeExtraPoint(teamIndex, key, 1, e);

    controlsDiv.append(minusBtn, countSpan, plusBtn);

    const removeBtn = document.createElement("button");
    removeBtn.classList.add("remove-btn");
    removeBtn.textContent = "✖";
    removeBtn.onclick = (e) => removeExtraPoint(teamIndex, key, e);

    li.append(nameSpan, controlsDiv, removeBtn);
    return li;
  });
}

//
// ─── OUTSIDE CLICK TO CLOSE SELECTORS / MODAL ──────────────────────────────────
//

// Close modal when clicking outside content
document.getElementById("team-editor-modal").addEventListener("click", (e) => {
  if (!document.getElementById("team-editor-content").contains(e.target)) {
    closeTeamEditor();
  }
});

// Close selectors when clicking outside
document
  .getElementById("team-editor-content")
  .addEventListener("click", (e) => {
    const ids = [
      "player-search-results",
      "extra-point-selector",
      "special-card-selector",
    ];
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el && !el.contains(e.target)) el.classList.add("hidden");
    });
  });

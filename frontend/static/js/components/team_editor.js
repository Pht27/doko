let currentEditTeamIndex = null;
// Open the modal and push a state for back button support
function openTeamEditor(teamIndex) {
  currentEditTeamIndex = teamIndex;

  const modal = document.getElementById("team-editor-modal");
  modal.classList.remove("modal--hidden");
  document.body.classList.add("modal-open");

  // This makes sure mobile recognizes a navigation
  if (!location.hash.includes("modal")) {
    location.hash = "#modal";
  }

  fillModal(teamIndex);
}

// Close the modal
function closeTeamEditor() {
  currentEditTeamIndex = null;
  const modal = document.getElementById("team-editor-modal");
  modal.classList.add("modal--hidden");
  document.body.classList.remove("modal-open");

  if (location.hash === "#modal") {
    history.back(); // remove hash from history stack
  }

  updateTeamBlocks();

  //   reset visuals
  const selector = document.getElementById("extra-point-selector");
  selector.classList.add("hidden");

  document.getElementById("player-search-results").classList.add("hidden");
  document.getElementById("player-search").value = "";

  const selector2 = document.getElementById("special-card-selector");
  selector2.classList.add("hidden");
}

//
// event listeners
//

function specialCardButtonHandleClick(event) {
  event.stopPropagation(); // prevent modal backdrop click
  const selector = document.getElementById("special-card-selector");
  selector.classList.toggle("hidden");
  selector.innerHTML = allSpecialCards
    .filter(
      (card) =>
        !roundData.teams[currentEditTeamIndex].special_cards.includes(card.name)
    )
    .map(
      (card) =>
        `<div class="selector-item" onclick="addSpecialCard('${card.name}')">${card.name}</div>`
    )
    .join("");
}
function extraPointButtonHandleClick(event) {
  event.stopPropagation(); // prevent modal backdrop click
  const selector = document.getElementById("extra-point-selector");
  selector.classList.toggle("hidden");

  selector.innerHTML = allExtraPoints
    .filter(
      (p) =>
        !Object.keys(
          roundData.teams[currentEditTeamIndex].extra_points
        ).includes(p.name)
    )
    .map(
      (p) =>
        `<div class="selector-item" onclick="addExtraPoint('${p.name}')">${p.name}</div>`
    )
    .join("");
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
  if (results === "") {
    results = "Keine Übereinstimmungen";
  }
  document.getElementById("player-search-results").innerHTML = results;
  document.getElementById("player-search-results").classList.remove("hidden");
}

function addSpecialCard(card) {
  roundData.teams[currentEditTeamIndex].special_cards.push(card);
  const selector = document.getElementById("special-card-selector");
  selector.classList.add("hidden");
  fillModal(currentEditTeamIndex); // rerender modal
}

function addExtraPoint(point) {
  roundData.teams[currentEditTeamIndex].extra_points[point] = 1;
  const selector = document.getElementById("extra-point-selector");
  selector.classList.add("hidden");
  fillModal(currentEditTeamIndex); // rerender modal
}

function addPlayer(playerId) {
  roundData.teams[currentEditTeamIndex].player_ids.push(playerId);
  document.getElementById("player-search-results").classList.add("hidden");
  document.getElementById("player-search").value = "";
  fillModal(currentEditTeamIndex); // rerender modal
}

// Click outside to close
document.getElementById("team-editor-modal").addEventListener("click", (e) => {
  const content = document.getElementById("team-editor-content");
  if (!content.contains(e.target)) {
    closeTeamEditor();
  }
});

// Click outside to close
document
  .getElementById("team-editor-content")
  .addEventListener("click", (e) => {
    const content = document.getElementById("player-search-results");
    if (!content.contains(e.target)) {
      content.classList.add("hidden");
    }
  });

// Click outside to close
document
  .getElementById("team-editor-content")
  .addEventListener("click", (e) => {
    const content = document.getElementById("extra-point-selector");
    if (!content.contains(e.target)) {
      content.classList.add("hidden");
    }
  });

// Click outside to close
document
  .getElementById("team-editor-content")
  .addEventListener("click", (e) => {
    const content = document.getElementById("special-card-selector");
    if (!content.contains(e.target)) {
      content.classList.add("hidden");
    }
  });

// Handle browser back button
window.addEventListener("hashchange", () => {
  if (location.hash !== "#modal") {
    closeTeamEditor();
  }
});

// renderings

function fillModal(teamIndex) {
  const team = roundData.teams[teamIndex];

  // Populate players
  const playersList = document.getElementById("team-players-list");
  playersList.innerHTML = "";
  getTeamNameFromPlayerIds(team.player_ids)
    .split(", ")
    .forEach((playerName, idx) => {
      const li = document.createElement("li");
      li.innerHTML = `${playerName} <button class="remove-btn" onclick="removePlayer(${teamIndex}, ${idx}, event)">✖</button>`;
      playersList.appendChild(li);
    });

  // Populate special cards
  const specialList = document.getElementById("team-special-list");
  specialList.innerHTML = "";
  (team.special_cards || []).forEach((card, idx) => {
    const li = document.createElement("li");
    li.innerHTML = `${card} <button class="remove-btn" onclick="removeSpecialCard(${teamIndex}, ${idx}, event)">✖</button>`;
    specialList.appendChild(li);
  });

  // Populate extra points
  const extraList = document.getElementById("team-extra-list");
  extraList.innerHTML = "";
  let lis = renderExtraPoints(team, teamIndex);
  for (li of lis) {
    extraList.appendChild(li);
  }
}

function renderExtraPoints(team, teamIndex) {
  let lis = [];

  Object.entries(team.extra_points || {}).forEach(([key, val]) => {
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

    controlsDiv.appendChild(minusBtn);
    controlsDiv.appendChild(countSpan);
    controlsDiv.appendChild(plusBtn);

    const removeBtn = document.createElement("button");
    removeBtn.classList.add("remove-btn");
    removeBtn.textContent = "✖";
    removeBtn.onclick = (e) => removeExtraPoint(teamIndex, key, e);

    li.appendChild(nameSpan);
    li.appendChild(controlsDiv);
    li.appendChild(removeBtn);

    lis.push(li);
  });
  return lis;
}

// Removing items
function removePlayer(teamIndex, playerIdx, event) {
  event.stopPropagation(); // prevent modal backdrop click
  roundData.teams[teamIndex].player_ids.splice(playerIdx, 1);
  fillModal(teamIndex); // re-render
}

function removeSpecialCard(teamIndex, cardIdx, event) {
  event.stopPropagation(); // prevent modal backdrop click
  roundData.teams[teamIndex].special_cards.splice(cardIdx, 1);
  openTeamEditor(teamIndex);
}

function removeExtraPoint(teamIndex, key, event) {
  event.stopPropagation(); // prevent modal backdrop click
  delete roundData.teams[teamIndex].extra_points[key];
  openTeamEditor(teamIndex);
}

function changeExtraPoint(teamIndex, point, delta, event) {
  event.stopPropagation(); // prevent modal backdrop click
  const team = roundData.teams[teamIndex];
  const current = team.extra_points[point];

  const newValue = current + delta;
  if (newValue < 1) return; // prevent below 1

  team.extra_points[point] = newValue;
  fillModal(currentEditTeamIndex);
}

// helper functions

function isPlayerAlreadyAdded(idToCheck) {
  for (let i = 1; i <= 4; i++) {
    if (roundData["teams"][i]["player_ids"].includes(idToCheck)) {
      return true;
    }
  }
  return false;
}

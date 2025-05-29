let allPlayers;
let allExtraPoints;
let allSpecialCards;
let allGameModes;

let roundData;

// for displaying in the right order
const switchOrderMap = {}; // teamIndex -> timestamp
let lastSwitchedTeamIndex = null;

document.addEventListener("DOMContentLoaded", () => {
  init();
});

// init functions

async function init(round = null) {
  allGameModes = await getGameModes();
  allPlayers = await getPlayers();
  allExtraPoints = await getExtraPoints();
  allSpecialCards = await getSpecialCards();

  round = roundData = {
    round_id: 3,
    time_stamp: null,
    game_mode: { game_mode_id: 3, game_mode_name: "Normal", is_solo: false },
    points: 1,
    winning_party: "Re",
    comments: [
      { id: 2, text: "Kaum zu glauben! -A." },
      { id: 3, text: "Outplayed -B." },
    ],
    teams: {
      1: {
        party: "Kontra",
        name: "Alice, Eve",
        special_cards: [],
        extra_points: {},
        player_ids: [1, 5],
      },
      2: {
        party: "Kontra",
        name: "Charlie",
        special_cards: ["Genscherdamen"],
        extra_points: {},
        player_ids: [3],
      },
      3: {
        party: "Re",
        name: "Diana",
        special_cards: [],
        extra_points: {},
        player_ids: [4],
      },
      4: {
        party: "Re",
        name: "Bob, Frank",
        special_cards: ["Kemmerich"],
        extra_points: { Fischauge: 2 },
        player_ids: [2, 6],
      },
    },
  };

  initRoundData(null);
  initGameModeSelector();
  initPoints();
  initWinningParty();

  updateTeamBlocks();
  updateGameMode();
  renderComments();
}

function initRoundData(round = null) {
  if (round) {
    roundData = round;
  } else {
    roundData = {
      round_id: null,
      time_stamp: null,
      game_mode: {
        game_mode_id: null,
        game_mode_name: "",
        is_solo: false,
      },
      points: null,
      winning_party: null,
      comments: [],
      teams: {
        1: {
          party: "Re",
          name: "",
          special_cards: [],
          extra_points: {},
          player_ids: [],
        },
        2: {
          party: "Re",
          name: "",
          special_cards: [],
          extra_points: {},
          player_ids: [],
        },
        3: {
          party: "Kontra",
          name: "",
          special_cards: [],
          extra_points: {},
          player_ids: [],
        },
        4: {
          party: "Kontra",
          name: "",
          special_cards: [],
          extra_points: {},
          player_ids: [],
        },
      },
    };
  }
}

function initGameModeSelector() {
  gameModes = allGameModes;
  const select = document.querySelector(".game-mode-select");

  gameModes.forEach((mode) => {
    const option = document.createElement("option");
    option.value = mode.id;
    option.textContent = mode.name;
    if (roundData.game_mode.game_mode_name) {
      if (mode.name === roundData.game_mode.game_mode_name) {
        option.selected = "selected";
      }
    } else if (mode.name === "Normal") {
      option.selected = "selected";
      console.log(roundData.game_mode.name);
    }
    select.appendChild(option);
  });
}

function initPoints() {
  if (roundData.points) {
    let pointsInput = document.querySelector(".points-box-input");
    pointsInput.value = roundData.points;
  }
}

function initWinningParty() {
  if (roundData.winning_party) {
    if (roundData.winning_party === "Re") {
      document.getElementById("re-checkbox").checked = true;
    }
    if (roundData.winning_party === "Kontra") {
      document.getElementById("kontra-checkbox").checked = true;
    }
  }
}

// update functions

function updateTeamBlocks() {
  let reBlocks = [];
  let kontraBlocks = [];

  for (let i = 1; i <= 4; i++) {
    const team = roundData.teams[i];
    const isEmpty = isTeamBlockEmpty(i);

    const innerHTML = isEmpty
      ? '<div class="add-team-block-note">Hinzufügen...</div>'
      : renderTeamContent(team);

    const block = {
      position: i,
      party: team.party,
      innerHTML,
      lastSwitchTime: switchOrderMap[i] || 0, // fallback to 0
    };

    if (team.party === "Re") {
      reBlocks.push(block);
    } else {
      kontraBlocks.push(block);
    }
  }

  // Sort within party by lastSwitchTime
  reBlocks.sort((a, b) => a.lastSwitchTime - b.lastSwitchTime);
  kontraBlocks.sort((a, b) => a.lastSwitchTime - b.lastSwitchTime);

  const teamBlocks = [...reBlocks, ...kontraBlocks];

  renderTeamBlocks(teamBlocks);
}

function updateGameMode() {
  const select = document.querySelector(".game-mode-select");
  const selectedId = parseInt(select.value, 10); // convert value to number

  const selectedMode = allGameModes.find((mode) => mode.id === selectedId);

  if (!selectedMode) {
    console.warn("Game mode not found for ID:", selectedId);
    return;
  }

  // Update roundData
  roundData.game_mode = {
    game_mode_id: selectedMode.id,
    game_mode_name: selectedMode.name,
    is_solo: Boolean(selectedMode.is_solo),
  };

  // Toggle .solo class on the select
  if (selectedMode.is_solo) {
    select.classList.add("solo");
  } else {
    select.classList.remove("solo");
  }
}

function updateWinningParty(event) {
  const selectedValue = event.target.value;
  const isChecked = event.target.checked;

  // Uncheck both checkboxes first
  document.getElementById("re-checkbox").checked = false;
  document.getElementById("kontra-checkbox").checked = false;

  if (isChecked) {
    // Re-check the one that was clicked
    event.target.checked = true;
    roundData["winning_party"] = selectedValue;
    renderWinningTeamBlocks(selectedValue);
  } else {
    // None selected
    roundData["winning_party"] = null;
    renderWinningTeamBlocks(null);
  }
}

function updatePoints() {
  let pointsInput = document.querySelector(".points-box-input");
  roundData.points = pointsInput.value;
}

function removeComment(commentIdToRemove) {
  console.log(commentIdToRemove);
  const index = roundData.comments.findIndex(
    (comment) => comment.id === commentIdToRemove
  );
  console.log(index);
  roundData.comments.splice(index, 1);
  console.log(roundData.comments);
  renderComments();
}

function discardComment() {
  let input = document.querySelector("#add-comment");
  input.value = "";
  hideCommentButtons();
}

function addComment() {
  const input = document.querySelector("#add-comment");
  if (input.value === "") {
    return;
  }
  const comment = { id: null, text: input.value };
  roundData.comments.push(comment);
  input.value = "";
  hideCommentButtons();
  renderComments();
}

// getter functions

async function getGameModes() {
  const url = "/api/get_game_modes";
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const json = await response.json();

    if (!Array.isArray(json)) {
      throw new Error("Invalid response format: expected an array");
    }

    return json;
  } catch (error) {
    console.error("Failed to fetch game modes:", error.message);
  }
}

async function getPlayers() {
  const url = "/api/get_active_players";
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const json = await response.json();

    if (!Array.isArray(json)) {
      throw new Error("Invalid response format: expected an array");
    }

    return json;
  } catch (error) {
    console.error("Failed to fetch players:", error.message);
  }
}

async function getExtraPoints() {
  const url = "/api/get_extra_points";
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const json = await response.json();

    if (!Array.isArray(json)) {
      throw new Error("Invalid response format: expected an array");
    }

    return json;
  } catch (error) {
    console.error("Failed to fetch extra points:", error.message);
  }
}

async function getSpecialCards() {
  const url = "/api/get_special_cards";
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const json = await response.json();

    if (!Array.isArray(json)) {
      throw new Error("Invalid response format: expected an array");
    }

    return json;
  } catch (error) {
    console.error("Failed to fetch special cards:", error.message);
  }
}

// Helper functions

function isTeamBlockEmpty(idToCheck) {
  return (
    roundData["teams"][idToCheck]["player_ids"].length === 0 &&
    Object.keys(roundData["teams"][idToCheck]["extra_points"]).length === 0 &&
    roundData["teams"][idToCheck]["special_cards"].length === 0
  );
}

function getTeamNameFromPlayerIds(playerIds) {
  let teamName = "";
  let moreThanOne = false;

  for (id of playerIds) {
    let relevantPlayers = allPlayers.filter((player) => player["id"] === id);
    let playerName = relevantPlayers[0]["name"];

    if (moreThanOne) {
      teamName += ", ";
    }

    teamName += playerName;

    moreThanOne = true;
  }

  return teamName;
}

function switchParty(teamId) {
  const currentParty = roundData.teams[teamId].party;
  roundData.teams[teamId].party = currentParty === "Re" ? "Kontra" : "Re";

  switchOrderMap[teamId] = Date.now(); // store UI-only switch time

  lastSwitchedTeamIndex = teamId;
}

// render functions

function renderTeamBlocks(teamBlocks) {
  const reContainer = document.querySelector("#re-column");
  const kontraContainer = document.querySelector("#kontra-column");

  const winningParty = roundData["winning_party"];

  // Clear existing blocks
  reContainer.innerHTML = "";
  kontraContainer.innerHTML = "";

  teamBlocks.forEach((team) => {
    const div = document.createElement("div");

    div.classList.add("team-block");
    div.id = `team-block-${team.position}`;
    div.innerHTML = team.innerHTML;

    if (team.position === lastSwitchedTeamIndex) {
      div.classList.add("incoming");
      requestAnimationFrame(() => {
        div.classList.add("slide-in");
      });
    }

    if (winningParty) {
      if (team.party === winningParty) {
        div.classList.add("winning");
      } else {
        div.classList.add("losing");
      }
    }

    enableSwipeToSwitch(div, team.position);

    // Append to correct container
    if (team.party === "Re") {
      reContainer.appendChild(div);
    } else if (team.party === "Kontra") {
      kontraContainer.appendChild(div);
    }
  });
}

function renderTeamContent(team) {
  const name = getTeamNameFromPlayerIds(team.player_ids);

  const specialCardsHTML = (team.special_cards || [])
    .map((card) => `<span>${card}</span><br />`)
    .join("");

  const extraPointsHTML = Object.entries(team.extra_points || {})
    .map(([key, value]) => `<span>${key} (${value})</span><br />`)
    .join("");

  return `
    <div class="team-info">
      <div class="team-name">${name}</div>

      ${
        specialCardsHTML
          ? `<div class="team-special">
            <strong>Sonderkarten:</strong><br />
            ${specialCardsHTML}
          </div>`
          : ""
      }

      ${
        extraPointsHTML
          ? `<div class="team-extra">
            <strong>Extrapunkte:</strong><br />
            ${extraPointsHTML}
          </div>`
          : ""
      }
    </div>
  `;
}

function renderWinningTeamBlocks(winningParty) {
  const reBlocks = document.querySelectorAll("#re-column .team-block");
  const kontraBlocks = document.querySelectorAll("#kontra-column .team-block");

  // Reset all team blocks
  [...reBlocks, ...kontraBlocks].forEach((block) => {
    block.classList.remove("winning", "losing");
  });

  if (winningParty === "Re") {
    reBlocks.forEach((block) => block.classList.add("winning"));
    kontraBlocks.forEach((block) => block.classList.add("losing"));
  } else if (winningParty === "Kontra") {
    kontraBlocks.forEach((block) => block.classList.add("winning"));
    reBlocks.forEach((block) => block.classList.add("losing"));
  }
}

function renderComments() {
  let commentList = document.querySelector(".comment-list");

  commentList.innerHTML = "";

  roundData.comments.forEach((comment) => {
    const wrapper = document.createElement("div");
    wrapper.classList.add("comment-wrapper");

    const commentText = document.createElement("div");
    commentText.classList.add("comment");
    commentText.innerHTML = comment.text;

    wrapper.appendChild(commentText);

    const deleteButton = document.createElement("button");
    deleteButton.classList.add("delete-comment-button");
    deleteButton.addEventListener("click", () => {
      removeComment(comment.id);
    });
    deleteButton.innerHTML = "✖";

    wrapper.appendChild(deleteButton);

    commentList.appendChild(wrapper);
  });
}

// animations

function enableSwipeToSwitch(element, teamIndex) {
  let startX = null;
  let swiped = false;
  const threshold = 50;

  element.addEventListener("touchstart", (e) => {
    startX = e.touches[0].clientX;
    swiped = false;
  });

  element.addEventListener("touchend", (e) => {
    if (startX === null) return;

    const endX = e.changedTouches[0].clientX;
    const deltaX = endX - startX;

    const direction = deltaX > 0 ? "right" : "left";
    const absDelta = Math.abs(deltaX);

    const team = roundData.teams[teamIndex];

    // Enforce direction
    const validSwipe =
      (team.party === "Re" && direction === "right") ||
      (team.party === "Kontra" && direction === "left");

    if (absDelta > threshold && validSwipe) {
      swiped = true;

      animateSwipeOut(element, direction);

      // Wait for swipe-out to finish, then switch + render
      setTimeout(() => {
        lastSwitchedTeamIndex = teamIndex; // 🔥 Set this right before update
        switchParty(teamIndex); // We'll handle render separately
        updateTeamBlocks();
      }, 150);
    }

    startX = null;
  });

  // Click handler — only if not swiped
  element.addEventListener("click", () => {
    if (swiped) return;
    teamBlockClickHandler(teamIndex);
  });
}

function animateSwipeOut(element, direction) {
  element.style.transition = "transform 0.15s ease-out, opacity 0.15s";
  element.style.opacity = "0";
  element.style.transform =
    direction === "right" ? "translateX(80%)" : "translateX(-80%)";
}

// event handlers
function teamBlockClickHandler(teamIndex) {
  openTeamEditor(teamIndex);
}

function showCommentButtons() {
  let commentButtonWrapper = document.querySelector(".comment-button-wrapper");
  commentButtonWrapper.classList.remove("hidden");
}

function hideCommentButtons() {
  let commentButtonWrapper = document.querySelector(".comment-button-wrapper");
  let input = document.querySelector("#add-comment");
  if (input.value.trim() === "") {
    commentButtonWrapper.classList.add("hidden");
    input.value = "";
  }
}

function saveGame() {
  if (!checkInput()) {
    return;
  }

  const jsDate = new Date();
  roundData.time_stamp = jsDate.toISOString();
  console.log(roundData);

  const cameToEdit = roundData.round_id;

  if (cameToEdit) {
    window.location.href = "/match_history";
    return;
  }
  resetForm();
}

function checkInput() {
  if (!roundData.game_mode.game_mode_id) {
    alert("Bitte Spielmodus angeben!");
    return false;
  }
  if (!roundData.points) {
    alert("Bitte Punkte angeben!");
    return false;
  }
  if (!roundData.winning_party) {
    alert("Bitte Siegerpartei angeben!");
    return false;
  }

  for (const [teamId, team] of Object.entries(roundData.teams)) {
    if (team.player_ids.length === 0) {
      alert("Bitte allen Teams mindestens eine Spieler*in zuweisen!");
      return false;
    }
  }

  return true;
}

function resetForm() {
  roundData.round_id = null;
  roundData.time_stamp = null;
  roundData.game_mode = null;
  roundData.points = null;
  roundData.winningParty = null;
  roundData.comments = [];

  Object.entries(roundData.teams).forEach(([teamId, team]) => {
    team.special_cards = [];
    team.extra_points = {};
  });

  document.getElementById("kontra-checkbox").checked = false;
  document.getElementById("re-checkbox").checked = false;
}

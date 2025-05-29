// Sort functionality
const sortSelect = document.getElementById("sortSelect");
const searchInput = document.getElementById("searchInput");
const toggleInactive = document.getElementById("toggleInactive");
const list = document.querySelector(".leaderboard__list");

const originalCards = Array.from(list.children); // full list
const addNewPlayerButton = originalCards[originalCards.length - 1];
originalCards.splice(originalCards.length - 1, 1);

function sortAndFilter() {
  const sortKey = sortSelect.value;
  const query = searchInput.value.toLowerCase();
  const showInactive = toggleInactive.checked;

  const filtered = originalCards.filter((card) => {
    const matchesSearch = card.dataset.name.includes(query);
    const isActive = card.dataset.active === "1";
    return matchesSearch && (isActive || showInactive);
  });

  const sorted = filtered.sort((a, b) => {
    let valA = a.dataset[sortKey];
    let valB = b.dataset[sortKey];
    return sortKey === "name"
      ? valA.localeCompare(valB)
      : parseFloat(valB) - parseFloat(valA);
  });

  list.style.opacity = 0;
  list.innerHTML = "";
  sorted.forEach((card) => {
    // Add inactive class if needed
    card.classList.toggle("inactive", card.dataset.active === "0");
    list.appendChild(card);
  });
  list.appendChild(addNewPlayerButton);
  list.style.opacity = 1;
}

document.addEventListener("DOMContentLoaded", () => {
  sortSelect.addEventListener("change", sortAndFilter);
  searchInput.addEventListener("input", sortAndFilter);
  toggleInactive.addEventListener("change", sortAndFilter);

  sortAndFilter();
});

async function addPlayer() {
  const playerName = prompt("Namen eingeben:");

  try {
    const response = await fetch("/api/add_player", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name: playerName }),
    });

    const result = await response.json();

    console.log(response);

    if (response.ok) {
      alert(result.message); // success message
      location.reload(); // reload to reflect changes
    } else {
      alert(result.error); // error message
    }
  } catch (error) {
    console.error("Request failed:", error);
    alert("Ein Fehler ist aufgetreten.");
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const sortSelect = document.getElementById("sortSelect");
  const searchInput = document.getElementById("searchInput");
  const toggleInactive = document.getElementById("toggleInactive");
  const list = document.querySelector(".leaderboard__list");

  const originalCards = Array.from(list.children); // full list

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
    setTimeout(() => {
      list.innerHTML = "";
      sorted.forEach((card) => {
        // Add inactive class if needed
        card.classList.toggle("inactive", card.dataset.active === "0");
        list.appendChild(card);
      });
      list.style.opacity = 1;
    }, 150);
  }

  sortSelect.addEventListener("change", sortAndFilter);
  searchInput.addEventListener("input", sortAndFilter);
  toggleInactive.addEventListener("change", sortAndFilter);

  sortAndFilter();
});

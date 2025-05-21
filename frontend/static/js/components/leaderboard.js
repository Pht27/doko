let currentSort = { key: null, direction: "asc" };

function sortColumn(header) {
  const table = document.getElementById("leaderboard__table");
  const key = header.dataset.sort;
  const direction =
    currentSort.key === key && currentSort.direction === "asc" ? "desc" : "asc";

  currentSort = { key, direction };
  sortTableByColumn(table, key, direction);

  // Reset all headers
  const headers = table.querySelectorAll("th");

  headers.forEach((h) => {
    if (h.dataset.label) {
      h.innerHTML = h.dataset.label;
    }
  });
}

function sortTableByColumn(table, key, direction) {
  const tbody = table.querySelector("tbody");
  const rows = Array.from(tbody.querySelectorAll("tr"));

  const index = key === "name" ? 0 : 1;
  const isNumeric = key === "points";

  rows.sort((a, b) => {
    const aVal = a.children[index].textContent.trim();
    const bVal = b.children[index].textContent.trim();

    const cmp = isNumeric
      ? parseFloat(aVal) - parseFloat(bVal)
      : aVal.localeCompare(bVal);

    return direction === "asc" ? cmp : -cmp;
  });

  rows.forEach((row) => tbody.appendChild(row));
}

document.addEventListener("DOMContentLoaded", () => {
  initTabs();
});

function initTabs() {
  initTabContent();
}

function initTabContent() {
  const specialCardsRadio = document.getElementById("tab-special-cards");
  specialCardsRadio.checked = true;
}

function updateTabContent() {
  // Hide all tab contents
  document.querySelectorAll(".tab-content").forEach((tab) => {
    tab.classList.remove("show");
  });

  // Get radio buttons
  const specialCardsRadio = document.getElementById("tab-special-cards");
  const extraPointsRadio = document.getElementById("tab-extra-points");
  const teamStatsRadio = document.getElementById("tab-team-partners");
  const statsAloneRadio = document.getElementById("tab-stats-alone");

  // Show the corresponding tab content
  if (specialCardsRadio.checked) {
    document.getElementById("content-special-cards").classList.add("show");
  } else if (extraPointsRadio.checked) {
    document.getElementById("content-extra-points").classList.add("show");
  } else if (teamStatsRadio.checked) {
    document.getElementById("content-team-partners").classList.add("show");
  } else if (statsAloneRadio.checked) {
    document.getElementById("content-stats-alone").classList.add("show");
  }
}

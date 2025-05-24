document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".match-container").forEach((container) => {
    const toggleButton = container.querySelector(".expand-toggle");
    const matchBody = container.querySelector(".match-body");
    const expandedBody = container.querySelector(".expanded-match-body");

    // Ensure expanded view is hidden on load
    expandedBody.classList.add("hidden");

    toggleButton.addEventListener("click", () => {
      const isExpanded = !expandedBody.classList.contains("hidden");

      if (isExpanded) {
        // Collapse back to regular view
        expandedBody.classList.add("hidden");
        matchBody.classList.remove("hidden");
        toggleButton.classList.remove("expanded");
      } else {
        // Expand to show details
        matchBody.classList.add("hidden");
        expandedBody.classList.remove("hidden");
        toggleButton.classList.add("expanded");
      }
    });
  });
});

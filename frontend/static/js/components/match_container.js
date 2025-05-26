document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".match-container").forEach((container) => {
    const toggleButton = container.querySelector(".expand-toggle");
    const matchBody = container.querySelector(".match-body");
    const expandedBody = container.querySelector(".expanded-match-body");
    const commentSection = container.querySelector(".comment-section");

    // Control buttons (excluding the toggle button)
    const controlButtons = container.querySelectorAll(
      ".match-controls .match-controls-button"
    );

    // Initial state: hide expanded view and control buttons
    expandedBody.classList.add("hidden");
    commentSection.classList.add("hidden");
    controlButtons.forEach((btn) => btn.classList.add("hidden"));

    toggleButton.addEventListener("click", () => {
      const isExpanded = !expandedBody.classList.contains("hidden");

      if (isExpanded) {
        // Collapse view
        expandedBody.classList.add("hidden");
        commentSection.classList.add("hidden");
        matchBody.classList.remove("hidden");
        toggleButton.classList.remove("expanded");
        controlButtons.forEach((btn) => btn.classList.add("hidden"));
      } else {
        // Expand view
        matchBody.classList.add("hidden");
        expandedBody.classList.remove("hidden");
        commentSection.classList.remove("hidden");
        toggleButton.classList.add("expanded");
        controlButtons.forEach((btn) => btn.classList.remove("hidden"));
      }
    });
  });
});

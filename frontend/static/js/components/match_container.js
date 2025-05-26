document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".match-container").forEach((container) => {
    const toggleButton = container.querySelector(".expand-toggle");
    const commentSection = container.querySelector(".comment-section");

    const teamBlocks = container.querySelectorAll(".team-block");
    const partyColumns = container.querySelectorAll(".party-column");
    const teamSpecials = container.querySelectorAll(".team-special");
    const teamExtras = container.querySelectorAll(".team-extra");

    // Control buttons (excluding the toggle button)
    const controlButtons = container.querySelectorAll(
      ".match-controls .match-controls-button"
    );

    // Initial state: hide expanded view and control buttons
    commentSection.classList.add("hidden");
    controlButtons.forEach((btn) => btn.classList.add("hidden"));
    teamSpecials.forEach((ts) => ts.classList.add("hidden"));
    teamExtras.forEach((te) => te.classList.add("hidden"));

    toggleButton.addEventListener("click", () => {
      const isExpanded = toggleButton.classList.contains("expanded");

      if (isExpanded) {
        // === COLLAPSE ===
        // 1. Start by hiding comment section
        commentSection.classList.remove("show");

        teamBlocks.forEach((block) => block.classList.remove("expanded"));
        partyColumns.forEach((col) => col.classList.remove("expanded"));
        teamSpecials.forEach((ts) => ts.classList.remove("show"));
        teamExtras.forEach((te) => te.classList.remove("show"));

        // 2. After delay, collapse rest
        setTimeout(() => {
          toggleButton.classList.remove("expanded");

          controlButtons.forEach((btn) => btn.classList.remove("show"));
        }, 0); // Adjust this to match your comment section transition
      } else {
        // === EXPAND ===
        // 1. Expand block elements
        toggleButton.classList.add("expanded");
        teamBlocks.forEach((block) => block.classList.add("expanded"));
        partyColumns.forEach((col) => col.classList.add("expanded"));
        controlButtons.forEach((btn) => btn.classList.add("show"));

        teamSpecials.forEach((ts) => ts.classList.add("show"));
        teamExtras.forEach((te) => te.classList.add("show"));

        // 2. Show comment section after a slight delay
        setTimeout(() => {
          commentSection.classList.add("show");
        }, 60); // Delay to make it appear *after* the team blocks
      }
    });
  });
});

async function addComment(button) {
  const roundId = button.getAttribute("data-round-id");
  const commentToAdd = prompt("Kommentar:");

  if (!commentToAdd || commentToAdd.trim() === "") return;

  const response = await fetch("/match_history/add_comment", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      round_id: roundId,
      comment: commentToAdd.trim(),
    }),
  });

  const result = await response.json();
  if (response.ok) {
    alert("Kommentar gespeichert.");
    // Optional: Refresh page or update UI dynamically
    location.reload(); // or inject the new comment into the DOM
  } else {
    alert("Fehler: " + result.error);
  }
}

document.addEventListener("DOMContentLoaded", function () {
  const matches = document.querySelectorAll(".match-container");
  const loadMoreBtn = document.getElementById("load-more");

  const CHUNK_SIZE = 16;
  let visibleCount = 0;

  function showNextChunk() {
    const nextChunkEnd = visibleCount + CHUNK_SIZE;

    for (let i = visibleCount; i < nextChunkEnd && i < matches.length; i++) {
      matches[i].classList.add("show");
    }

    visibleCount = nextChunkEnd;

    if (visibleCount >= matches.length) {
      loadMoreBtn.style.display = "none"; // Hide button if all items shown
    }
  }

  showNextChunk();

  loadMoreBtn.addEventListener("click", showNextChunk);
});

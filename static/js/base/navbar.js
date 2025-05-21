const menuToggle = document.getElementById("menuToggle");
const overlayMenu = document.getElementById("overlayMenu");

menuToggle.addEventListener("click", () => {
  overlayMenu.classList.toggle("active");
});

document.querySelectorAll(".overlay-menu a").forEach((link) =>
  link.addEventListener("click", () => {
    overlayMenu.classList.remove("active");
  })
);

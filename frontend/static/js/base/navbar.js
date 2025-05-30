const menuToggle = document.getElementById("menuToggle");
const overlayMenu = document.getElementById("overlayMenu");

menuToggle.addEventListener("click", () => {
  overlayMenu.classList.toggle("active");
  menuToggle.classList.toggle("active");
});

document.querySelectorAll(".overlay-menu a").forEach((link) =>
  link.addEventListener("click", (e) => {
    menuToggle.classList.remove("active");
    overlayMenu.classList.remove("active");
    e.stopPropagation();
  })
);

document.querySelectorAll(".overlay-menu").forEach((link) =>
  link.addEventListener("click", () => {
    menuToggle.classList.remove("active");
    overlayMenu.classList.remove("active");
  })
);

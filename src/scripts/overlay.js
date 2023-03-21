const overlayIcon = document.getElementById("info");
const overlay = document.getElementById("overlay");

overlayIcon.addEventListener("click", function () {
  this.classList.toggle("open");
  overlay.classList.toggle("open");
});

function escape(event) {
  if (event.key === "Escape" && overlay.classList.contains("open")) {
    overlayIcon.classList.remove("open");
    overlay.classList.remove("open");
  }
}

export { overlayIcon, overlay, escape };

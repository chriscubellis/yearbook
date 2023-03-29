const overlayIcon = document.getElementById("overlay-toggle");
const overlay = document.getElementById("overlay");
const body = document.body;

overlayIcon.addEventListener("click", function () {
  this.classList.toggle("open");
  overlay.classList.toggle("open");
  if (body.classList.contains("portrait-open")) {
    body.classList.remove("portrait-open");
  }
});

function escape(event) {
  if (event.key === "Escape" && overlay.classList.contains("open")) {
    overlayIcon.classList.remove("open");
    console.log("escape");
    overlay.classList.remove("open");
    if (body.classList.contains("portrait-open")) {
      body.classList.remove("portrait-open");
    }
  }
}

export { overlayIcon, overlay, escape };

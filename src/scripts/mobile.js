// mobile.js

function MobileWarning() {
  const playButton = document.getElementById("play");
  const mobileWarning = document.getElementById("mobile-warning");

  playButton.addEventListener("click", function (event) {
    const screenWidth = window.innerWidth;

    if (screenWidth <= 767) {
      event.preventDefault();
      mobileWarning.classList.add("open");
    }
  });

  document
    .querySelector("aside.slide-up, #close")
    .addEventListener("click", function (event) {
      if (event.target.classList.contains("modal-content")) {
        return;
      }
      this.classList.remove("open");
    });
}

function MobileShare() {
  const shareLink = document.getElementById("share-link");

  if (navigator.share) {
    shareLink.addEventListener("click", async () => {
      try {
        await navigator.share({
          title: "GIPHY 2023 Yearbook",
          text: "Share this link to your desktop device :)",
          url: window.location.href,
        });
      } catch (error) {
        console.error("Sharing failed:", error);
      }
    });
  } else {
    shareLink.style.display = "none";
  }
}

function IsMobileDevice() {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
}

document.addEventListener("DOMContentLoaded", function () {
  if (IsMobileDevice()) {
    MobileWarning();
    MobileShare();
  }
});

export { MobileWarning, MobileShare, IsMobileDevice };

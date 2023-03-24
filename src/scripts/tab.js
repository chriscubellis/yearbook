export function handleTitleAndFavicon() {
  var pageTitle = document.title;
  var active = true;

  // Change title and favicon when tab is active
  function changeTitleAndFavicon() {
    if (!active) {
      document.title = pageTitle;
      active = true;
    }
  }

  // Switch back title and favicon when tab is inactive
  function switchBackTitleAndFavicon() {
    if (active) {
      document.title = "🐱 Meow come back!";
      active = false;
    }
  }

  // Listen for tab visibility and focus changes
  document.addEventListener("visibilitychange", function () {
    if (document.hidden) {
      switchBackTitleAndFavicon();
    } else {
      changeTitleAndFavicon();
    }
  });

  document.addEventListener("blur", function () {
    switchBackTitleAndFavicon();
  });

  document.addEventListener("focus", function () {
    changeTitleAndFavicon();
  });
}

function SafariWarning() {
  if (
    navigator.userAgent.indexOf("Safari") != -1 &&
    navigator.userAgent.indexOf("Mac") != -1 &&
    !(navigator.userAgent.indexOf("Chrome") != -1)
  ) {
    console.log("Oh no, its Safari...");

    setTimeout(() => {
      document.body.classList.add("safari");
    }, 333);

    document.addEventListener("click", function (event) {
      if (
        event.target.id === "play-anyways" ||
        event.target.id === "hide-banner"
      ) {
        document.body.classList.remove("safari");
      }
    });
  }
}

export { SafariWarning };

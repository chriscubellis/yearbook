import { Application } from "@splinetool/runtime";
import SceneUrl from "url:../src/assets/models/scene.splinecode";
import { CanvasCapture } from "canvas-capture";
import { Loader } from "../src/scripts/loader.js";

const canvas = document.getElementById("canvas3d");
const spline = new Application(canvas);
Loader();

async function loadScene() {
  try {
    const response = await fetch(SceneUrl);
    const contentLength = response.headers.get("Content-Length");
    const reader = response.body.getReader();
    let receivedLength = 0;
    let chunks = [];
    const decoding = new TextDecoder();
    while (true) {
      const result = await reader.read();
      if (result.done) break;
      chunks.push(result.value);
      receivedLength += result.value.length;

      const percentage = Math.round((receivedLength / contentLength) * 100);

      // Update the loading progress percentage on the UI
      document.getElementById(
        "download-percentage"
      ).textContent = `${percentage}%`;
    }

    const blob = new Blob(chunks);
    const url = URL.createObjectURL(blob);

    // Download Percentage ⬇️
    const download = document.getElementById("download");
    const downloadLabel = document.getElementById("download-label");
    const downloadPercentage = document.getElementById("download-percentage");

    // Processing State 🔄
    const processing = document.getElementById("processing");
    const processingLabel = document.getElementById("processing-label");
    const processingPercentage = document.getElementById(
      "processing-percentage"
    );

    // Building Scene 👷‍♀️
    const build = document.getElementById("build");
    const buildLabel = document.getElementById("build-label");
    const buildPercentage = document.getElementById("build-percentage");

    // Show Loader 🟩🟧🟥🟪🟦
    const Loader = document.getElementById("preloader");
    download.classList.add("inactive");
    let buildProgress = 0;
    const preparingBuildInterval = setInterval(function () {
      if (buildProgress === 0) {
        processing.classList.remove("inactive");
      } else {
        clearInterval(preparingBuildInterval);
        processing.classList.add("inactive");
        build.classList.remove("inactive");
      }
    }, 100);

    // Reveal Scene 🙀
    await spline.load(url);
    console.log("😻 Ready Player One");

    buildProgress = 100;

    // Remove Loader ❎
    setTimeout(function () {
      Loader.classList.add("hidden");
      document.body.classList.add("scene-loaded");
      capture();
    }, 10);

    // Kitty 9 Lives Counter (Not Working) ☠️
    function deathCounter() {
      const kitty = spline.findObjectByName("Cat");
      spline.addEventListener("mouseDown", (e) => {
        if (e.target.name === "Cat") {
          console.log("🙀 Meow!");
        }
      });

      spline.addEventListener("start", (e) => {
        if (e.target.name === "Cat") {
          console.log("😿 Oop ");
        }
      });
    }
    deathCounter();
  } catch (error) {
    console.error(error);
  }
}
loadScene();

// Toggle Soundtrack 🔊
function toggleSound() {
  const soundElement = document.querySelector("#sound");
  const sceneSound = spline.findObjectByName("Scene Sound Controller");

  if (soundElement.classList.contains("muted")) {
    // Remove muted class and emit mouseUp event
    soundElement.classList.remove("muted");
    sceneSound.emitEvent("mouseUp");
  } else {
    // Add muted class and emit mouseDown event
    soundElement.classList.add("muted");
    sceneSound.emitEvent("mouseDown");
  }
}
document.querySelector("#sound").addEventListener("click", toggleSound);

// Toggle Fullscreen ↔️
function toggleFullScreen() {
  const fullScreenElement = document.querySelector("#fullscreen");

  if (fullScreenElement.classList.contains("active")) {
    console.log("exiting full screen");
    document.exitFullscreen();
    fullScreenElement.classList.remove("active");
  } else {
    console.log("requesting full screen");
    document.documentElement.requestFullscreen();
    fullScreenElement.classList.add("active");
  }
}
document
  .querySelector("#fullscreen")
  .addEventListener("click", toggleFullScreen);

// Screen Capture 📸
function capture() {
  CanvasCapture.init(document.getElementById("canvas3d"), {
    showRecDot: true,
  });

  CanvasCapture.bindKeyToPNGSnapshot("p", {
    name: "my-giphy-yearbook-screenie",
    dpi: 144,
  });

  const cameraButton = document.querySelector("#camera");

  cameraButton.addEventListener("click", () => {
    const event = new KeyboardEvent("keypress", { key: "p" });
    console.log("ding");
    document.dispatchEvent(event);
  });

  function loop() {
    requestAnimationFrame(loop);
    CanvasCapture.checkHotkeys();
  }

  loop(); // Start loop.
}

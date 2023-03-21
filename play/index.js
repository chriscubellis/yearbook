import { Application } from "@splinetool/runtime";
import SceneUrl from "url:../src/assets/models/scene.splinecode";

import { loader } from "../src/scripts/loader.js";

// Call the loader() function
loader();

const canvas = document.getElementById("canvas3d");

const spline = new Application(canvas);
fetch(SceneUrl)
  .then((response) => {
    const reader = response.body.getReader();
    const contentLength = response.headers.get("Content-Length");
    let receivedLength = 0;
    let chunks = [];
    let decoding = new TextDecoder();

    reader.read().then(function processResult(result) {
      if (result.done) {
        const blob = new Blob(chunks);
        const url = URL.createObjectURL(blob);

        var download = document.getElementById("download");
        var downloadLabel = document.getElementById("download-label");
        var downloadPercentage = document.getElementById("download-percentage");

        var processing = document.getElementById("processing");
        var processingLabel = document.getElementById("processing-label");
        var processingPercentage = document.getElementById(
          "processing-percentage"
        );

        var build = document.getElementById("build");
        var buildLabel = document.getElementById("build-label");
        var buildPercentage = document.getElementById("build-percentage");

        var loader = document.getElementById("preloader");

        download.classList.add("inactive");

        // "Preparing Build..." loop
        var preparingBuildInterval = setInterval(function () {
          if (buildProgress === 0) {
            processing.classList.remove("inactive");
          } else {
            clearInterval(preparingBuildInterval);
            processing.classList.add("inactive");
            build.classList.remove("inactive");
          }
        }, 100);

        var buildProgress = 0;

        spline.load(url).then(() => {
          console.log("😻 Ready Player One");

          buildProgress = 100;

          setTimeout(function () {
            loader.classList.add("hidden");
            document.body.classList.add("scene-loaded");
          }, 0);
        });

        return;
      }
      chunks.push(result.value);
      receivedLength += result.value.length;

      console.log(
        `🐱 Loading... ${Math.round((receivedLength / contentLength) * 100)}%`
      );

      // Update the loading progress percentage on the UI
      document.getElementById(
        "download-percentage"
      ).textContent = `${Math.round((receivedLength / contentLength) * 100)}%`;
      return reader.read().then(processResult);
    });

    // Toggle Soundtrack
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

    // Toggle Fullscreen
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
  })

  .catch((error) => {
    console.error(error);
  });

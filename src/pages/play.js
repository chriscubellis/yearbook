import { Application } from "@splinetool/runtime";

const canvas = document.getElementById("canvas3d");

const spline = new Application(canvas);
fetch("https://prod.spline.design/ce5eVkNRvwPHJM6H/scene.splinecode")
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
  })
  .catch((error) => {
    console.error(error);
  });

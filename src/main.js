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
        spline.load(url).then(() => {
          console.log("Ready Player One 🐱");
          document.getElementById("preloader").classList.add("scene-loaded");
        });
        return;
      }
      chunks.push(result.value);
      receivedLength += result.value.length;
      console.log(
        `Loading... ${Math.round((receivedLength / contentLength) * 100)}%`
      );
      // Update the loading progress percentage on the UI
      document.getElementById("loading-progress").textContent = `${Math.round(
        (receivedLength / contentLength) * 100
      )}%`;
      return reader.read().then(processResult);
    });
  })
  .catch((error) => {
    console.error(error);
  });

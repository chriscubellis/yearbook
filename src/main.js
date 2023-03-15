import { Application } from "@splinetool/runtime";

const canvas = document.getElementById("canvas3d");

const spline = new Application(canvas);
fetch("https://prod.spline.design/tX2Dq5nCW6mA6MKs/scene.splinecode")
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
          document.getElementById("preloader").classList.add("hidden");
        });
        return;
      }
      chunks.push(result.value);
      receivedLength += result.value.length;
      console.log(
        `Loading... ${Math.round((receivedLength / contentLength) * 100)}%`
      );

      return reader.read().then(processResult);
    });
  })
  .catch((error) => {
    console.error(error);
  });

const overlayIcon = document.getElementById("info");
const overlay = document.getElementById("overlay");

overlayIcon.addEventListener("click", function () {
  this.classList.toggle("open");
  overlay.classList.toggle("open");
  console.log("ding");
});

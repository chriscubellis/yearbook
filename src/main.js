import { Application } from "@splinetool/runtime";
import SplineUrl from "url:./assets/models/splash.splinecode";

const canvas = document.getElementById("canvas3d");

const spline = new Application(canvas);
fetch(SplineUrl)
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
        spline.load(url).then(() => {});
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

import { overlayIcon, overlay, escape } from "./scripts/overlay.js";

document.addEventListener("keydown", escape);

// mobile warning
import {
  mobileWarning,
  mobileShare,
  isMobileDevice,
} from "./scripts/mobile.js";

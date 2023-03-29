import { Application } from "@splinetool/runtime";
import SplineUrl from "url:../../src/assets/models/franzese_dave.splinecode";

fetch("portraits/directory.html")
  .then((response) => response.text())
  .then((text) => {
    // Parse the HTML response
    const parser = new DOMParser();
    const html = parser.parseFromString(text, "text/html");

    // Get the JPG and WebP files from the HTML response
    const files = Array.from(html.querySelectorAll("a"))
      .filter((a) => a.href.endsWith(".jpg"))
      .map((a) => ({
        jpg: a.href,
        webp: a.dataset.webp,
        name: a.dataset.name,
        slug: a.dataset.slug,
      }));

    // Preload the WebP images
    const webpImages = files.map((file) => {
      const webpImg = new Image();
      webpImg.src = file.webp;
      return webpImg;
    });

    // Wait for all WebP images to load before adding images to the grid
    Promise.all(webpImages.map((img) => img.decode()))
      .then(() => {
        // Create the grid elements
        const images = files.map((file) => {
          const img = new Image();
          img.src = file.jpg;
          img.alt = "";
          img.addEventListener("load", () => {
            const wrapper = document.createElement("div");
            wrapper.style.position = "relative";
            wrapper.style.zIndex = "1";
            img.style.width = "100%";
            img.style.height = "100%";
            img.style.objectFit = "cover";
            img.style.position = "absolute";
            img.style.top = "0";
            img.style.left = "0";
            wrapper.appendChild(img);

            // Add the h3 element with the data-name attribute
            const name = document.createElement("h3");
            name.textContent = file.name;
            wrapper.appendChild(name);

            // Add the data-slug attribute
            wrapper.dataset.slug = file.slug;

            img.addEventListener("click", () => {
              console.log(`Clicked ${file.jpg}`);
              document.body.classList.add("portrait-open");
            });
            grid.appendChild(wrapper);
          });
          return img;
        });

        // Add the images to the grid
        images.forEach((img) => {
          grid.appendChild(img);
        });

        // Call the new script after the grid is loaded
        addClickListeners();
      })
      .catch((error) => {
        console.log(error);
      });
  })
  .catch((error) => {
    console.log(error);
  });

function addClickListeners() {
  const wrappers = document.querySelectorAll("#grid div");
  wrappers.forEach((wrapper) => {
    wrapper.addEventListener("click", () => {
      console.log(`Clicked ${wrapper.dataset.name}`);
      document.body.classList.add("portrait-open");
    });
  });
}

// Scene 🐈

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

// Overlay

const overlayIcon = document.getElementById("close");
const overlay = document.getElementById("overlay");

overlayIcon.addEventListener("click", function () {
  document.body.classList.toggle("portrait-open");
  overlay.classList.toggle("open");
});

function escape(event) {
  if (event.key === "Escape" && overlay.classList.contains("open")) {
    overlayIcon.classList.remove("open");
    overlay.classList.remove("open");
    document.body.classList.toggle("portrait-open");
  }
}

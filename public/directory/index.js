console.log("🐱 Kitty welcomes you to The Directory");
import { sceneUrls } from "./models/scenes.js";
import { SplineViewer } from "@splinetool/viewer";

// Find the grid element
const grid = document.getElementById("grid");

let sceneIndex = 0;

// Get the JPG and WebP files from the portraits directory
fetch("portraits/directory.html")
  .then((response) => response.text())
  .then(async (text) => {
    // Parse the HTML response
    const parser = new DOMParser();
    const html = parser.parseFromString(text, "text/html");

    // Get the JPG and WebP files from the HTML response
    const files = Array.from(html.querySelectorAll("a"))
      .filter((a) => a.href.endsWith(".jpg"))
      .map((a, index) => ({
        jpg: a.href,
        webp: a.dataset.webp,
        name: a.getAttribute("data-name"),
        sceneIndex: index % sceneUrls.length, // Loop through the scene file URLs
      }));

    // Shuffle the files array randomly
    for (let i = files.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [files[i], files[j]] = [files[j], files[i]];
    }

    // Preload the WebP images
    const webpImages = await Promise.all(
      files.map((file) => {
        const webpImg = new Image();
        webpImg.src = file.webp;
        return webpImg.decode();
      })
    );

    // Create the grid elements
    const images = files.map((file) => {
      const img = new Image();
      img.src = file.jpg;
      img.alt = "";
      img.addEventListener("load", () => {
        const wrapper = document.createElement("div");
        wrapper.classList.add("portrait");
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

        img.addEventListener("mouseenter", () => {
          console.log(`Mouse entered ${file.jpg}`);
          const webpImg = new Image();
          webpImg.src = file.webp;
          webpImg.alt = "";
          webpImg.style.width = "100%";
          webpImg.style.height = "100%";
          webpImg.style.objectFit = "cover";
          webpImg.style.position = "absolute";
          webpImg.style.top = "0";
          webpImg.style.left = "0";
          wrapper.appendChild(webpImg);
          img.style.visibility = "hidden";
          wrapper.addEventListener("mouseleave", () => {
            console.log(`Mouse left ${file.jpg}`);
            wrapper.removeChild(webpImg);
            img.style.visibility = "visible";
            img.style.zIndex = "2";
            wrapper.style.zIndex = "1";
          });
        });
        wrapper.dataset.name = file.name;
        wrapper.dataset.sceneIndex = file.sceneIndex;
        grid.appendChild(wrapper);
      });

      return img;
    });

    // Add the images to the grid
    grid.append(...images);

    // Remove the loader element
    const loader = document.getElementById("grid-loader");
    if (loader) {
      setTimeout(() => {
        loader.remove();
      }, 500);
    }

    addClickListeners();
  })
  .catch((error) => {
    console.log(error);
  });

function addClickListeners() {
  const overlayToggle = document.getElementById("overlay-toggle");
  let splineViewer = null;

  // Open the overlay when a grid item is clicked
  grid.addEventListener("click", (event) => {
    const portrait = event.target.closest(".portrait");
    if (!portrait) {
      return;
    }

    console.log(`Clicked ${portrait.dataset.name}`);
    document.body.classList.add("portrait-open");

    // Replace the giphy-name element with the clicked portrait's name
    const giphyName = document.getElementById("giphy-name");
    giphyName.textContent = portrait.dataset.name;

    // Create the slug from the name and update the overlay content
    const name = portrait.dataset.name;
    const slug = name.replace(/\s+/g, "-").toLowerCase();
    const overlayContent = document.querySelector(".overlay-content");
    overlayContent.dataset.slug = slug;

    // Find the corresponding scene URL from the sceneUrls array
    const scene = sceneUrls.find((s) => s.slug === slug);
    const sceneUrl = scene.url;

    // Set the data-scene-index attribute of the overlay to the scene index
    const sceneIndex = portrait.dataset.sceneIndex;
    overlayContent.setAttribute("data-scene-index", sceneIndex);

    // Load the scene when the overlay is opened
    if (!splineViewer) {
      const canvas = document.getElementById("canvas");

      splineViewer = document.createElement("spline-viewer");
      splineViewer.loadingAnim = true;

      splineViewer.url = sceneUrl;

      // Add the spline-viewer element to the canvas div
      canvas.appendChild(splineViewer);
    }

    function escape(event) {
      if (event.key === "Escape") {
        document.body.classList.remove("portrait-open");
        document.removeEventListener("keydown", escape);
        // Remove the spline viewer element when the overlay is closed
        if (splineViewer) {
          const canvas = document.getElementById("canvas");
          canvas.removeChild(splineViewer);
          splineViewer = null;

          const gl =
            canvas.getContext("webgl") ||
            canvas.getContext("experimental-webgl");

          // Get a list of all supported WebGL extensions
          const extensions = gl.getSupportedExtensions();

          // Iterate over the list of extensions and forcibly lose their contexts
          for (let i = 0; i < extensions.length; i++) {
            const extension = gl.getExtension(extensions[i]);
            if (extension && typeof extension.loseContext === "function") {
              extension.loseContext();
            }
          }
        }
      }
    }
    document.addEventListener("keydown", escape);
  });

  overlayToggle.addEventListener("click", () => {
    console.log(`Clicked #overlay-toggle`);
    document.body.classList.remove("portrait-open");
    // Remove the spline viewer element when the overlay is closed
    if (splineViewer) {
      const canvas = document.getElementById("canvas");
      canvas.removeChild(splineViewer);
      splineViewer = null;
    }
  });
}

function getGradientColors(sceneIndex) {
  const colors = ["$pink", "$orange", "$teal", "$green", "$indigo", "$purple"];
  const startIndex = sceneIndex % colors.length;
  const endIndex = (startIndex + 1) % colors.length;
  return [colors[startIndex], colors[endIndex]];
}

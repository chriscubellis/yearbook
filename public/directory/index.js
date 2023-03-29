console.log("🐱 Kitty welcomes you to The Directory");

// Find the grid element
const grid = document.getElementById("grid");

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
      .map((a) => ({
        jpg: a.href,
        webp: a.dataset.webp,
        name: a.getAttribute("data-name"),
      }));

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
        ("");
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
        grid.appendChild(wrapper);
      });

      return img;
    });

    // Add the images to the grid
    grid.append(...images);

    addClickListeners();
  })
  .catch((error) => {
    console.log(error);
  });

function addClickListeners() {
  const overlayToggle = document.getElementById("overlay-toggle");
  let splineViewer = null;
  let sceneIndex = 0;

  const sceneUrls = [
    "https://prod.spline.design/mj2ZxMr8bkgvzm0O/scene.splinecode",
    "https://prod.spline.design/9G3q3dD6ZjU6wF5K/scene.splinecode",
    "https://prod.spline.design/9NvZlYpJjR1n8WwA/scene.splinecode",
    "https://prod.spline.design/7XgDv4tK4Hf4Yc8W/scene.splinecode",
    "https://prod.spline.design/7K8vKpJ6JyE6Gy1W/scene.splinecode",
  ];

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

    // Load the scene when the overlay is opened
    if (!splineViewer) {
      const canvas = document.getElementById("canvas");

      const splineViewerScript = document.createElement("script");
      splineViewerScript.type = "module";
      splineViewerScript.src =
        "https://unpkg.com/@splinetool/viewer@0.9.277/build/spline-viewer.js";
      document.head.appendChild(splineViewerScript);

      splineViewer = document.createElement("spline-viewer");
      splineViewer.loadingAnim = true;
      splineViewer.url = sceneUrls[sceneIndex];

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
        }
      }
    }
    document.addEventListener("keydown", escape);

    // Increment the scene index and reset to 0 if it exceeds the number of scene URLs
    sceneIndex++;
    if (sceneIndex >= sceneUrls.length) {
      sceneIndex = 0;
    }
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

// Overlay ❎
import { overlayIcon, overlay, escape } from "../../src/scripts/overlay.js";

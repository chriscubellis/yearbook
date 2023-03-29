console.log("🐱 Kitty welcomes you to The Directory");

// Find the grid element
const grid = document.getElementById("grid");

// Get the JPG and WebP files from the portraits directory
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
              img.style.display = "none";
              wrapper.addEventListener("mouseleave", () => {
                console.log(`Mouse left ${file.jpg}`);
                wrapper.removeChild(webpImg);
                img.style.display = "block";
                img.style.zIndex = "2";
                wrapper.style.zIndex = "1";
              });
            });
            grid.appendChild(wrapper);
          });
          return img;
        });

        // Add the images to the grid
        images.forEach((img) => {
          grid.appendChild(img);
        });
      })
      .catch((error) => {
        console.log(error);
      });
  })
  .catch((error) => {
    console.log(error);
  });

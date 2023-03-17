export function loader() {
  const loader = document.getElementById("loader");

  const colors = [
    { name: "green", value: "rgba(0, 255, 153, 1)" },
    { name: "blue", value: "rgba(0, 204, 255, 1)" },
    { name: "purple", value: "rgba(156, 39, 176, 1)" },
    { name: "red", value: "rgba(255, 102, 102, 1)" },
    { name: "yellow", value: "rgba(255, 243, 92, 1)" },
  ];

  function darken(color, amount) {
    const rgba = color
      .replace(/[^0-9,]+/g, "")
      .split(",")
      .map((num) => parseInt(num, 10));
    rgba[0] = Math.max(0, rgba[0] - amount);
    rgba[1] = Math.max(0, rgba[1] - amount);
    rgba[2] = Math.max(0, rgba[2] - amount);
    return `rgba(${rgba[0]}, ${rgba[1]}, ${rgba[2]}, ${rgba[3]})`;
  }

  for (let i = 0; i < 5; i++) {
    const cube = document.createElement("div");
    cube.classList.add("cube");
    cube.style.animationDelay = `${i * 0.2}s`;
    cube.style.webkitAnimationDelay = `${i * 0.2}s`;
    cube.style.background = colors[i].value;

    for (let j = 0; j < 6; j++) {
      const side = document.createElement("div");
      side.classList.add("side");

      const colorFactor = j === 1 || j === 3 ? 20 : 40;
      // Set the first side (front face) to 100% opacity
      side.style.background =
        j === 0 ? colors[i].value : darken(colors[i].value, colorFactor);

      const transforms = [
        "translateZ(var(--size))",
        "rotateY(90deg) translateZ(var(--size))",
        "rotateY(180deg) translateZ(var(--size))",
        "rotateY(-90deg) translateZ(var(--size))",
        "rotateX(90deg) translateZ(var(--size))",
        "rotateX(-90deg) translateZ(var(--size))",
      ];
      side.style.transform = transforms[j];

      cube.appendChild(side);
    }

    loader.appendChild(cube);
  }
}

import { Application } from "@splinetool/runtime";

const canvas = document.getElementById("canvas3d");

const spline = new Application(canvas);
spline
  .load("https://prod.spline.design/ce5eVkNRvwPHJM6H/scene.splinecode")
  .then(() => {
    console.log("Ready Player One 🐱");
  });

import { Engine, SceneLoader } from "babylonjs";
import TestScene from "./scenes/TestScene";
import TestScene2 from "./scenes/TestScene2";
import { engine } from "./globals";

export const start = async () => {

  const scene = new TestScene2();
  // Hide loading icon
  const loader = document.querySelectorAll(".is-active")[0];
  loader.className = loader.className.replace("is-active", "");

  engine.runRenderLoop(() => {
    scene.render();
    engine.wipeCaches(true);
  });

  window.addEventListener("resize", () => {
    engine.resize();
  });
};

start();

import { Engine, SceneLoader } from "babylonjs";
import TestScene from "./scenes/TestScene";

export const start = async () => {
  if (Engine.isSupported()) {
    const canvas: any = document.getElementById("canvas");
    const engine = new Engine(canvas, true, {
      deterministicLockstep: true,
      lockstepMaxSteps: 4,
    });

    const scene = new TestScene(engine, canvas);
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
  } else {
    alert("Babylon cannot find a WebGL context");
  }
};

start();

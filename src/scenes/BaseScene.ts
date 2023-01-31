import { CannonJSPlugin, Engine, IPhysicsEnginePlugin, Scene, Vector3 } from "babylonjs";
import Controller from "../controllers/Controller";
import TestController from "../controllers/TestController";
import Player from "../objects/Player";
import * as CANNON from "cannon";
import EntityObject from "../objects/EntityObject";
import { FPS_COUNT_, GRAVITY, TIME_STEP_ } from "../globals";
export default class BaseScene extends Scene {
  physEngine: IPhysicsEnginePlugin;
  canvas: any;
  constructor(engine: Engine, canvas: any) {
    super(engine);
    this.canvas = canvas;
    this.physEngine = new CannonJSPlugin(true, 10, CANNON);
  }
  addPhysics() {
    console.log(`GRAVITY: ${GRAVITY}`);
    this.gravity = GRAVITY;
    this.enablePhysics(GRAVITY, this.physEngine);
    this.physEngine.setTimeStep(TIME_STEP_);
  }
}

import { CannonJSPlugin, Engine, IPhysicsEnginePlugin, Scene, Vector3 } from "babylonjs";
import Controller, { UFICommand } from "../controllers/Controller";
import TestController from "../controllers/TestController";
import Player from "../objects/Player";
import * as CANNON from "cannon";
import EntityObject from "../objects/EntityObject";
import { FPS_COUNT_, GRAVITY, TIME_STEP_, engine } from "../globals";
export default class BaseScene extends Scene {
  pass: number = 1;
  physEngine: IPhysicsEnginePlugin = undefined;
  constructor() {
    super(engine);
    this.physicsEnabled = false;
  }
  addPhysics(gravity: Vector3) {
    console.log(`GRAVITY: ${gravity}`);
    this.physEngine = new CannonJSPlugin(true, 10, CANNON);
    this.physicsEnabled = true;
    this.enablePhysics(gravity, this.physEngine);
    this.physEngine.setTimeStep(TIME_STEP_);
  }

}

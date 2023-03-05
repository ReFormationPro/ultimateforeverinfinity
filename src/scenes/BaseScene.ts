import {
  CannonJSPlugin,
  Engine,
  IPhysicsEnginePlugin,
  Scene,
  Vector3,
} from "babylonjs";
import * as CANNON from "cannon";
import { TIME_STEP_ } from "../globals";

export default class BaseScene extends Scene {
  pass: number = 1;
  physEngine: IPhysicsEnginePlugin;
  canvas: any;
  constructor(engine: Engine, canvas: any) {
    super(engine);
    this.canvas = canvas;
    this.physEngine = new CannonJSPlugin(true, 10, CANNON);
  }
  addPhysics(gravity: Vector3) {
    console.log(`GRAVITY: ${gravity}`);
    this.enablePhysics(gravity, this.physEngine);
    this.physEngine.setTimeStep(TIME_STEP_);
  }
}

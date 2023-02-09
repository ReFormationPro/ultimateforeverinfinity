import { CannonJSPlugin, Engine, IPhysicsEnginePlugin, Mesh, Node, Scene, Vector3 } from "babylonjs";
import TestController from "../controllers/TestController";
import Player from "../objects/Player";
import * as CANNON from "cannon";
import EntityObject from "../objects/EntityObject";
import { FPS_COUNT_, GRAVITY, TIME_STEP_, engine } from "../globals";
export default class BaseScene extends Scene {
  pass: number = 1;
  physEngine: IPhysicsEnginePlugin = undefined;
  gravityMagnitude: number = undefined;
  entityObjects: EntityObject[] = [];
  constructor() {
    super(engine);
    this.physicsEnabled = false;
  }
  addPhysics(gravity: number) {
    console.log(`GRAVITY: ${gravity}`);
    this.physEngine = new CannonJSPlugin(true, 10, CANNON);
    this.physicsEnabled = true;
    this.physEngine.setTimeStep(TIME_STEP_);
    this.gravityMagnitude = gravity;
    this.enablePhysics(Vector3.Zero(), this.physEngine);

    this.onBeforeRenderObservable.add(() => {
      for (const entityObject of this.entityObjects) {
        if (entityObject.calcGravity) {
          entityObject.gravity = this.calcGravity(entityObject);
          if (entityObject.gravity !== undefined) {
            console.log(entityObject.gravity);

            entityObject.compoundMesh.physicsImpostor.applyForce(
              entityObject.gravity, entityObject.compoundMesh.position
            );
          }
        }
      }
    })
  }
  calcGravity(_: EntityObject) {
    return Vector3.Zero();
  }
}

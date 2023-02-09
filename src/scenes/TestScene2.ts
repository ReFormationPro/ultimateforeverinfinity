import { Color3, Engine, HemisphericLight, Mesh, MeshBuilder, Node, PhysicsImpostor, Vector3 } from "babylonjs";
import UFIPlane from "../objects/UFIPlane";

import UFIGround from "../objects/UFIGround";
import BaseScene from "./BaseScene";

import { BoxCollider, JumpCollider } from "../objects/Collider";
import UFICamera from "../objects/UFICamera";
import Player from "../objects/Player";
import { Controller } from "../controllers/Controller";
import PlayerController from "../controllers/PlayerController";
import {
  GRAVITY,
  GRAVITY_MAG,
  PLAYER_IDLE,
  canvas,
} from "../globals";
import UFIAnimation from "../time/UFIAnimation";
import AnimatedController from "../controllers/AnimatedController";
import TestController from "../controllers/TestController";
import UFISphere from "../objects/UFISphere";
import EntityObject from "../objects/EntityObject";

export default class TestScene2 extends BaseScene {
  player: Player;
  controller: Controller;
  gravityPts: Vector3[];
  constructor() {
    super();
    //CREATE OBJECTS
    this.player = new Player(this, 1, 1, new Vector3(0, -20, 0));
    console.log(`this.player.compoundMesh.position:${this.player.compoundMesh.position}`);

    // This creates a light, aiming 0,1,0 - to the sky (non-mesh)
    var light = new HemisphericLight("light", new Vector3(0, 1, 0), this);

    let camera = new UFICamera(this, canvas, this.player.compoundMesh.position);

    this.player.setCamera(camera);
    this.player.setDynamicTexture();

    let ball = new UFISphere(this, 10, 4);
    ball.position = Vector3.Zero();

    this.player.setCollider(
      new BoxCollider(
        this,
        this.player.width,
        this.player.height,
        .5,
        null,
        null,
        Color3.Blue()
      )
    );
    //GRAVITATIONAL PTS
    this.gravityPts = [
      ball.position
    ];
    //ENABLE PHYSICS
    this.addPhysics(GRAVITY_MAG);
    this.player.addPhysics(1);
    ball.addPhysics(0, 0, 0, PhysicsImpostor.SphereImpostor);
    //CONTROLLER
    this.controller = new TestController(this);
    this.player.drawDynamicTexture(PLAYER_IDLE);
    // this.controller = new PlayerController(this, canvas);
    // this.controller = new AnimatedController(
    //   this,
    //   canvas,
    //   [PLAYER_IDLE],
    //   [
    //     PLAYER_WALKING_F1,
    //     PLAYER_WALKING_F2
    //   ],
    //   [
    //     PLAYER_WALKING_B1,
    //     PLAYER_WALKING_B2
    //   ],
    //   [
    //     PLAYER_WALKING_L1,
    //     PLAYER_WALKING_L2
    //   ],
    //   [
    //     PLAYER_WALKING_R1,
    //     PLAYER_WALKING_R2
    //   ]
    // );
    // const controller = (<AnimatedController>this.controller);
    // this.player.addAnimation([
    //   controller.idleAnim,
    //   controller.walkingFAnim,
    //   controller.walkingBAnim,
    //   controller.walkingLAnim,
    //   controller.walkingRAnim
    // ]);

    this.player.addController(this.controller);
    // console.log(walkingAnim.obj);
  }
  calcGravity(entityObject: EntityObject) {
    if (entityObject.compoundMesh !== undefined) {
      const currPos = entityObject.compoundMesh.position;
      if (this.gravityPts.indexOf(currPos) === -1) {
        if (currPos === undefined) {
          Error("The compound mesh has undefined coordinates.")
        }
        // Normally there could be multiple objects pulling.
        return this.gravityPts[0].subtract(currPos).normalize().multiplyByFloats(
          this.gravityMagnitude,
          this.gravityMagnitude,
          this.gravityMagnitude
        );
      }
    }
    return undefined;
  }
}

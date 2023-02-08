import { Color3, Engine, HemisphericLight, MeshBuilder, PhysicsImpostor, Vector3 } from "babylonjs";
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
  PLAYER_IDLE,
} from "../globals";
import UFIAnimation from "../time/UFIAnimation";
import AnimatedController from "../controllers/AnimatedController";
import TestController from "../controllers/TestController";
import UFISphere from "../objects/UFISphere";

export default class TestScene2 extends BaseScene {
  player: Player;
  controller: Controller;
  constructor(engine: Engine, canvas: any) {
    super(engine, canvas);
    //CREATE OBJECTS
    this.player = new Player(this, 1, 1, new Vector3(0, 20, 0));
    console.log(`this.player.compoundMesh.position:${this.player.compoundMesh.position}`);

    // This creates a light, aiming 0,1,0 - to the sky (non-mesh)
    var light = new HemisphericLight("light", new Vector3(0, 1, 0), this);

    let camera = new UFICamera(this, this.canvas, this.player.compoundMesh.position);

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
    //ENABLE PHYSICS
    this.addPhysics(GRAVITY);
    this.player.addPhysics(1);
    ball.addPhysics(0, 0, 0, PhysicsImpostor.SphereImpostor);
    //CONTROLLER
    this.controller = new TestController(this, this.canvas);
    this.player.drawDynamicTexture(PLAYER_IDLE);
    // this.controller = new PlayerController(this, this.canvas);
    // this.controller = new AnimatedController(
    //   this,
    //   this.canvas,
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
}

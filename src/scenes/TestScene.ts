import { Color3, Engine, HemisphericLight, MeshBuilder, PhysicsImpostor, Vector3 } from "babylonjs";
import FacingPlane from "../objects/FacingPlane";
import UFIPlane from "../objects/UFIPlane";

import UFIGround from "../objects/UFIGround";
import BaseScene from "./BaseScene";

import { BoxCollider, JumpCollider } from "../objects/Collider";
import UFICamera from "../objects/UFICamera";
import TestController from "../controllers/TestController";
import Player from "../objects/Player";
import { Controller } from "../controllers/Controller";
import PlayerController from "../controllers/PlayerController";
import { PLAYER_DIR, PLAYER_IMG_DIR } from "../globals";
import UFIAnimationManager from "../objects/UFIAnimation";

export default class TestScene extends BaseScene {
  player: Player;
  controller: Controller;
  constructor(engine: Engine, canvas: any) {
    super(engine, canvas);


    //CREATE OBJECTS

    this.player = new Player(this, PLAYER_IMG_DIR, 1, 1, new Vector3(1, 2, 3));
    // This creates a light, aiming 0,1,0 - to the sky (non-mesh)
    var light = new HemisphericLight("light", new Vector3(0, 1, 0), this);

    // Default intensity is 1. Let's dim the light a small amount
    light.intensity = 0.7;

    // Our built-in 'ground' shape, call once, singleton doesnt work due to hot-reload
    let ground = new UFIGround(this, 60, 60);
    let dummy = new UFIPlane(this, 6, 8, new Vector3(5, 4, 20));
    let facingDummy = new UFIPlane(this, 6, 8, new Vector3(5, 4, -20), Vector3.Zero(), true);

    let ball = MeshBuilder.CreateSphere('', { diameter: 1, segments: 4 }, this);
    let ball2 = MeshBuilder.CreateSphere('', { diameter: 1, segments: 4 }, this);
    let ball3 = MeshBuilder.CreateSphere('', { diameter: 1, segments: 4 }, this);

    let ball4 = MeshBuilder.CreateSphere('', { diameter: 1, segments: 4 }, this);
    let ball5 = MeshBuilder.CreateSphere('', { diameter: 1, segments: 4 }, this);

    ball2.position = new Vector3(1, 2, 3);
    ball3.position = new Vector3(2, 4, 6);
    ball4.position = new Vector3(5, 4, 20);
    ball5.position = new Vector3(5, 4, -20);

    let camera = new UFICamera(this, canvas, this.player.compoundMesh.position);

    this.player.setCamera(camera);
    // this.player.setCollider(
    //   new JumpCollider(
    //     this,
    //     this.player.height,
    //     null,
    //     null,
    //     Color3.Red()
    //   ),
    //   true
    // );
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
    const am = new UFIAnimationManager({
      walkForward: ["player_3", "player_4"],
      walkBackward: ["player_6", "player_7"],
      walkRight: ["player_12", "player_13"],
      walkLeft: ["player_15", "player_16"]
    }, PLAYER_DIR)
    this.player.setAnimation(am)
    //ENABLE PHYSICS
    this.addPhysics();
    this.player.addPhysics(3);
    ground.addPhysics();
    dummy.addPhysics();
    //CONTROLLER
    // this.controller = new TestController(this, canvas);
    this.controller = new PlayerController(this, canvas);
    this.player.addController(this.controller);
  }
}

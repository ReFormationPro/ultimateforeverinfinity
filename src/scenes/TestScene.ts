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
  SPRITESHEET_DIR,
  SPRITESHEET_MAP_DIR,
  PLAYER_IDLE,
  PLAYER_WALKING_F1,
  PLAYER_WALKING_F2,
  PLAYER_WALKING_B1,
  PLAYER_WALKING_B2,
  PLAYER_WALKING_R1,
  PLAYER_WALKING_R2,
  PLAYER_WALKING_L1,
  PLAYER_WALKING_L2
} from "../globals";
import UFIAnimation from "../objects/UFIAnimation";
import AnimatedController from "../controllers/AnimatedController";

export default class TestScene extends BaseScene {
  player: Player;
  controller: Controller;
  constructor(engine: Engine, canvas: any) {
    super(engine, canvas);
    //CREATE OBJECTS



    this.player = new Player(this, 1, 1, new Vector3(1, 2, 3));
    console.log(`this.player.compoundMesh.position:${this.player.compoundMesh.position}`);

    // This creates a light, aiming 0,1,0 - to the sky (non-mesh)
    var light = new HemisphericLight("light", new Vector3(0, 1, 0), this);

    let camera = new UFICamera(this, this.canvas, this.player.compoundMesh.position);

    this.player.setCamera(camera);

    // console.log(SPRITESHEET_DIR);
    // console.log(SPRITESHEET_MAP_DIR);


    // this.player.setTexture(SPRITESHEET_DIR);
    // this.player.mapSprites(SPRITESHEET_MAP_DIR);
    // this.player.drawSprite();

    this.player.setDynamicTexture();
    // this.player.drawDynamicTexture(PLAYER_IDLE);



    // Our built-in 'ground' shape, call once, singleton doesnt work due to hot-reload
    let ground = new UFIGround(this, 60, 60);
    let dummy = new UFIPlane(this, 6, 8, new Vector3(5, 4, 20));
    let facingDummy = new UFIPlane(this, 6, 8, new Vector3(5, 4, -20), Vector3.Zero(), true);

    let ball = MeshBuilder.CreateSphere('', { diameter: 1, segments: 4 }, this);
    let ball2 = MeshBuilder.CreateSphere('', { diameter: 1, segments: 4 }, this);
    let ball3 = MeshBuilder.CreateSphere('', { diameter: 1, segments: 4 }, this);

    let ball4 = MeshBuilder.CreateSphere('', { diameter: 1, segments: 4 }, this);
    let ball5 = MeshBuilder.CreateSphere('', { diameter: 1, segments: 4 }, this);

    // ball2.position = new Vector3(1, 2, 3);
    ball3.position = new Vector3(2, 4, 6);
    ball4.position = new Vector3(5, 4, 20);
    ball5.position = new Vector3(5, 4, -20);


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
    //ENABLE PHYSICS
    this.addPhysics(GRAVITY);
    this.player.addPhysics(1);
    ground.addPhysics();
    dummy.addPhysics();
    //CONTROLLER
    // this.controller = new TestController(this, this.canvas);
    // this.controller = new PlayerController(this, this.canvas);
    this.controller = new AnimatedController(
      this,
      this.canvas,
      [PLAYER_IDLE],
      [
        PLAYER_WALKING_F1,
        PLAYER_WALKING_F2
      ],
      [
        PLAYER_WALKING_B1,
        PLAYER_WALKING_B2
      ],
      [
        PLAYER_WALKING_L1,
        PLAYER_WALKING_L2
      ],
      [
        PLAYER_WALKING_R1,
        PLAYER_WALKING_R2
      ]
    );
    this.player.addAnimation((<AnimatedController>this.controller).idleAnim);
    this.player.addAnimation((<AnimatedController>this.controller).walkingFAnim);
    this.player.addAnimation((<AnimatedController>this.controller).walkingBAnim);
    this.player.addAnimation((<AnimatedController>this.controller).walkingLAnim);
    this.player.addAnimation((<AnimatedController>this.controller).walkingRAnim);
    this.player.addController(this.controller);

    // console.log(walkingAnim.obj);
  }
}

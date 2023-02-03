import TexturedPlane from "./TexturedPlane";
import {
  ArcRotateCamera,
  Vector3,
  Scene,
  Tools,
  Ray,
  RayHelper,
} from "babylonjs";
import { Controller, UFICommand } from "../controllers/Controller";
import PlayerController from "../controllers/PlayerController";
import { PLAYER_IMG_DIR, PLAYER_DIR } from "../globals";
import UFIPlane from "./UFIPlane";

export default class Player extends UFIPlane {
  constructor(
    scene: Scene,
    width: number = 1,
    height: number = 1,
    position: Vector3 = new Vector3(0, height / 2, 0),
    rotation: Vector3 = new Vector3(0, 0, 0),
    speed: number = 10,
    jumpSpeed: number = speed,
  ) {
    super(scene, width, height, position, rotation, true);
    // console.log(`url: ${url}`);
    //units per second
    this.speed = speed;
    this.jumpSpeed = jumpSpeed;
    this.mesh.isPickable = false;
  }
  addController(controller: Controller) {
    controller.player = this;
    this.scene.onBeforeRenderObservable.add(() => {
      controller.listenInput();
    });
    const playerController = <PlayerController>controller;
    if (
      playerController.managePointerLock !== undefined &&
      playerController.managePointerLock !== null
    ) {
      playerController.managePointerLock();
    }
  }
}

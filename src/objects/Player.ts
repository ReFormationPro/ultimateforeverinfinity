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
import UFIPlane from "./UFIPlane";

export default class Player extends UFIPlane {
  constructor(
    scene: Scene,
    width: number = 1,
    height: number = 1,
    position: Vector3 = Vector3.Zero(),
    up: Vector3 = Vector3.Up(),
    target: Vector3 = Vector3.Forward(),
    speed: number = 10,
    jumpSpeed: number = speed,
    jumpCount: number = 2
  ) {
    super(scene, width, height, position, up, target, true);
    // console.log(`url: ${url}`);
    //units per second
    this.speed = speed;
    this.jumpSpeed = jumpSpeed;
    this.jumpCount = jumpCount;
    this.mesh.isPickable = false;
  }
  addController(controller: Controller) {
    controller.entityObject = this;
    controller.addEventListeners();
    const playerController = <PlayerController>controller;
    if (
      playerController.managePointerLock !== undefined &&
      playerController.managePointerLock !== null
    ) {
      playerController.managePointerLock();
    }
  }
}

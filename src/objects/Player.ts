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

export default class Player extends TexturedPlane {
  constructor(
    scene: Scene,
    url: string = PLAYER_IMG_DIR,
    width: number = 1,
    height: number = 1,
    position: Vector3 = new Vector3(0, height / 2, 0),
    rotation: Vector3 = new Vector3(0, 0, 0),
    speed: number = 5,
    jumpSpeed: number = 60,
  ) {
    super(scene, url, width, height, position, rotation, true);
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

  animateFrame(command: UFICommand, deltaTime: number) {
    if (command.displacement.equals(Vector3.Forward())) {
      this.animationManager.anims.walkForward.animateFrame(deltaTime, this);
    }
    if (command.displacement.equals(Vector3.Backward())) {
      this.animationManager.anims.walkBackward.animateFrame(deltaTime, this);
    }
    if (command.displacement.equals(Vector3.Left())) {
      this.animationManager.anims.walkLeft.animateFrame(deltaTime, this);
    }
    if (command.displacement.equals(Vector3.Right())) {
      this.animationManager.anims.walkRight.animateFrame(deltaTime, this);
    }
  }
}

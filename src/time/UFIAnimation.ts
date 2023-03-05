import { Scene } from "babylonjs";
import EntityObject from "../objects/EntityObject";
import UFITimer from "./UFITimer";

export default class UFIAnimation {
  obj: EntityObject;
  range: Array<string>;
  timer: UFITimer = undefined;
  scene: Scene;
  index: number = 0;
  delayInSeconds: number = undefined;
  constructor(
    scene: Scene,
    range: Array<string>,
    secondsBetweenFrames: number
  ) {
    this.range = range;
    this.scene = scene;
    this.delayInSeconds = secondsBetweenFrames;
  }

  animateNextFrame(self = undefined) {
    if (self === undefined) {
      self = this;
    }
    // console.log(self);
    self.obj.drawDynamicTexture(self.range[self.index]);
    self.index = (self.index + 1) % self.range.length;
  }
  start() {
    if (this.timer === undefined) {
      this.timer = new UFITimer(
        this.scene,
        false,
        this.delayInSeconds,
        true,
        this.animateNextFrame,
        this
      );
    }
    this.timer.enable();
  }
  stop() {
    if (this.timer !== undefined) {
      this.timer.disable();
    }
  }
}

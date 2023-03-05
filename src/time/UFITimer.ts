import { Observer, Scene } from "babylonjs";

export default class UFITimer {
  //frame times in seconds
  scene: Scene = undefined;
  observer: Observer<Scene> = undefined;
  frameTime: number = undefined;
  prevFrameTime: number = undefined;
  deltaTime: number = undefined;
  secondsTimeout: number = undefined;
  secondsLeft: number = undefined;
  callback: (args: Array<any>) => any = undefined;
  args: Array<any> | any = undefined;
  enabled: boolean = false;
  calledSinceStart: boolean = false;
  constructor(
    scene: Scene,
    enabled: boolean = false,
    seconds: number = 0,
    executeOnCreate: boolean = false,
    callback: (args: Array<any>) => any = () => undefined,
    args: Array<any> | any = undefined
  ) {
    this.enabled = enabled;
    this.scene = scene;
    this.secondsTimeout = seconds;
    this.secondsLeft = seconds;
    this.callback = callback;
    this.args = args;
    if (executeOnCreate) {
      this.callback(this.args);
    }
    this.enable();
  }

  enable() {
    if (this.observer === undefined || !this.enabled) {
      this.observer = this.scene.onBeforeRenderObservable.add(() => {
        this.calcDeltaTime();
        if (this.deltaTime !== undefined) {
          this.callbackOnTimeout();
        }
      });
      this.enabled = true;
    }
  }
  disable() {
    this.calledSinceStart = false;

    if (this.enabled) {
      this.scene.onBeforeRenderObservable.remove(this.observer);
      this.observer = undefined;
      this.enabled = false;
    }
  }

  callbackOnTimeout() {
    if (this.secondsTimeout !== 0) {
      this.secondsLeft -= this.deltaTime;
      if (this.secondsLeft <= 0) {
        // console.log(`${this.secondsTimeout} passed`);
        this.secondsLeft = this.secondsTimeout;
        this.callback(this.args);
      }
    } else if (!this.calledSinceStart) {
      console.log("wtf");

      this.callback(this.args);
      this.calledSinceStart = true;
    }
    u;
  }

  calcDeltaTime() {
    this.prevFrameTime = this.frameTime;
    this.frameTime = Date.now() / 1000;
    if (this.prevFrameTime === undefined) {
      this.prevFrameTime = this.frameTime;
      return undefined;
    }
    return (this.deltaTime = this.frameTime - this.prevFrameTime);
  }
}

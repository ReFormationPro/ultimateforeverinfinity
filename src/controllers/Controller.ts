import { Vector3, Scene, ActionManager, ExecuteCodeAction, IPhysicsEnginePlugin, KeyboardInfo } from "babylonjs";
export class UFICommand {
  displacement: Vector3 = Vector3.Zero();
  gravity: Vector3 = Vector3.Zero();
  // A coordinate in the opposite direction of the target
  negTarget: Vector3;
  // current up vector
  up: Vector3;
  test: boolean = false;
}
import Player from "../objects/Player";
export abstract class Controller {

  command: UFICommand;
  player: Player;
  inputMapQueue: Array<object> = [{}, {}];
  singleTypeKeys: Array<string>
  scene: Scene;

  constructor(scene: Scene, singleTypeKeys: Array<string>) {
    this.scene = scene;
    this.command = new UFICommand();
    this.singleTypeKeys = singleTypeKeys;
    scene.actionManager = new ActionManager(scene);

    scene.actionManager.registerAction(
      new ExecuteCodeAction(ActionManager.OnKeyDownTrigger, (evt) => {

        const srcEvt = evt.sourceEvent;
        const key = srcEvt.key;

        const inputMapOld = this.inputMapQueue.pop();
        const inputMap = structuredClone(this.inputMapQueue[0]);

        // if (this.singleTypeKeys.indexOf(key) !== -1) {
        //   inputMap[key] = false;
        //   if (inputMap[key] === undefined && inputMapOld[key] === undefined) {
        //     inputMap[key] = true;
        //     console.log(inputMap);
        //   }
        // }
        // else {
        //   inputMap[key] = srcEvt.type === "keydown";
        // }
        inputMap[key] = true;

        this.inputMapQueue.unshift(inputMap);
      })
    );
    scene.actionManager.registerAction(
      new ExecuteCodeAction(ActionManager.OnKeyUpTrigger, (evt) => {
        // console.log(`evt.sourceEvent.type: ${evt.sourceEvent.type}`);
        this.inputMapQueue.pop();
        const inputMap = structuredClone(this.inputMapQueue[0]);

        inputMap[evt.sourceEvent.key] = false;
        // inputMap[evt.sourceEvent.key] = evt.sourceEvent.type === "keydown";
        this.inputMapQueue.unshift(inputMap);
      })
    );
    //https://www.sitepoint.com/community/t/disable-different-keyboard-short-cuts-and-clicks-using-javascript-and-jquery/277794/3
    //Disable the context menu
    // document.addEventListener('contextmenu', event => {
    //   event.preventDefault();
    // })
    // //Disable essential hotkeys (ctrl+qcvxswpuaz)
    // document.body.addEventListener('keydown', event => {
    //   console.log(event.key, event.ctrlKey);
    //   if (event.ctrlKey && 'qcvxswpuaz'.indexOf(event.key) !== -1) {
    //     event.preventDefault();
    //     event.stopPropagation();
    //   }
    // })
  }
  move(negTarget: Vector3) {
    this.setNegTarget(negTarget);
    this.calcUpVector();
    this.player.move(this.command);
  }
  rotate() { }
  calcUpVector() {
    if (!this.scene.physicsEnabled || this.command.gravity.equals(Vector3.Zero())) {
      this.command.up = Vector3.Up()
    }
    else {
      this.command.up = this.command.gravity.negate().normalize();
    }
  }
  // children should implement these
  setNegTarget(negTarget: Vector3) { }
  listenInput() { }
}

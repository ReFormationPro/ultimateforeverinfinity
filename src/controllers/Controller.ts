import { Vector3, Scene, ActionManager, ExecuteCodeAction, IPhysicsEnginePlugin } from "babylonjs";
export class UFICommand {
  displacement: Vector3;
  gravity: Vector3;
  constructor(
    displacement: Vector3 = Vector3.Zero(),
    gravity: Vector3 = Vector3.Zero()
  ) {
    this.displacement = displacement;
    this.gravity = gravity;
  }
}
import Player from "../objects/Player";
export abstract class Controller {

  command: UFICommand;
  player: Player;
  inputMap: object = {};
  canvas: any;
  scene: Scene;

  constructor(scene: Scene, canvas: any) {
    const self = this;
    this.scene = scene;
    this.canvas = canvas;
    this.command = new UFICommand();

    this.inputMap = {};
    scene.actionManager = new ActionManager(scene);

    scene.actionManager.registerAction(
      new ExecuteCodeAction(ActionManager.OnKeyDownTrigger, (evt) => {
        self.inputMap[evt.sourceEvent.key] = evt.sourceEvent.type === "keydown";
      })
    );
    scene.actionManager.registerAction(
      new ExecuteCodeAction(ActionManager.OnKeyUpTrigger, (evt) => {
        self.inputMap[evt.sourceEvent.key] = evt.sourceEvent.type === "keydown";
      })
    );
    //https://www.sitepoint.com/community/t/disable-different-keyboard-short-cuts-and-clicks-using-javascript-and-jquery/277794/3
    //Disable the context menu
    document.addEventListener('contextmenu', event => {
      event.preventDefault()
    })
    //Disable essential hotkeys (ctrl+cvxspwuaz)
    document.body.addEventListener('keydown', event => {
      if (event.ctrlKey && 'cvxspwuaz'.indexOf(event.key) !== -1) {
        event.preventDefault()
      }
    })

  }
  move() {
    this.player.move(this.command);
  }
  rotate() { }
  // children should implement this
  listenInput() { }
}

import EntityObject from "./EntityObject";
import { Scene, Tools, ArcRotateCamera, Vector3 } from "babylonjs";
export default class UFICamera extends EntityObject {
  camObj: ArcRotateCamera = undefined;
  obj: EntityObject;
  constructor(
    scene: Scene,
    canvas: any,
    position: Vector3 = undefined,
    radius = 30
  ) {
    super(scene, "camera");

    this.camObj = new ArcRotateCamera(
      "camera1",
      BABYLON.Tools.ToRadians(-90),
      BABYLON.Tools.ToRadians(90),
      radius,
      position,
      scene
    );
    this.camObj.lowerRadiusLimit = radius / 2;
    this.camObj.upperRadiusLimit = radius * 3;
    this.camObj.lowerBetaLimit = BABYLON.Tools.ToRadians(45);
    this.camObj.upperBetaLimit = BABYLON.Tools.ToRadians(135);

    this.camObj.attachControl(canvas, true);
  }
}

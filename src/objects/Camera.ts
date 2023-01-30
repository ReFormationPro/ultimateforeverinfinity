import EntityObject from "./EntityObject";
import { Scene, Tools, ArcRotateCamera, Vector3 } from "babylonjs";
export default class UFICamera extends EntityObject {
  camObj: ArcRotateCamera = undefined;
  obj: EntityObject;
  constructor(
    scene: Scene,
    canvas: any,
    position: Vector3 = undefined,
    radius = 20,
    lowerAlphaLimitDegrees = undefined,
    upperAlphaLimitDegrees = undefined,
    lowerBetaLimitDegrees = 45,
    upperBetaLimitDegrees = 135,
    lowerRadiusLimit = 10,
    upperRadiusLimit = 50,
    angularSensibilityX = 500,
    angularSensibilityY = 500,
  ) {
    super(scene, "camera");

    this.camObj = new ArcRotateCamera(
      "camera1",
      BABYLON.Tools.ToRadians(-90),
      BABYLON.Tools.ToRadians(90),
      0,
      position,
      scene
    );

    this.camObj.lowerAlphaLimit = Tools.ToRadians(lowerAlphaLimitDegrees);
    this.camObj.upperAlphaLimit = Tools.ToRadians(upperAlphaLimitDegrees);
    this.camObj.lowerBetaLimit = Tools.ToRadians(lowerBetaLimitDegrees);
    this.camObj.upperBetaLimit = Tools.ToRadians(upperBetaLimitDegrees);
    this.camObj.lowerRadiusLimit = lowerRadiusLimit;
    this.camObj.upperRadiusLimit = upperRadiusLimit;
    this.camObj.angularSensibilityX = angularSensibilityX;
    this.camObj.angularSensibilityY = angularSensibilityY;
    this.camObj.radius = radius;
    this.camObj.attachControl(canvas, true);
  }
}

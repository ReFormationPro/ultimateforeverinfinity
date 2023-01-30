import { DynamicTexture, Scene, StandardMaterial, Texture, Vector3 } from "babylonjs";
import FacingPlane from "./FacingPlane";
import UFIPlane from "./UFIPlane";

export default class TexturedPlane extends UFIPlane {
  dynamicTexture: DynamicTexture;

  constructor(
    scene: Scene,
    url: string,
    width: number,
    height: number,
    position: Vector3 = new Vector3(0, 0, 0),
    rotation: Vector3 = new Vector3(0, 0, 0),
    isFacing: boolean = false
  ) {
    super(scene, width, height, position, rotation, isFacing);
    const texturedFacingPlaneMat = new StandardMaterial(
      "player_01",
      this.scene
    );

    this.dynamicTexture = new DynamicTexture(
      "dynamicTexture",
      64,
      this.scene,
      true,
      Texture.NEAREST_NEAREST
    );

    texturedFacingPlaneMat.diffuseTexture = this.dynamicTexture;
    texturedFacingPlaneMat.diffuseTexture.hasAlpha = true;
    // texturedFacingPlaneMat.backFaceCulling = true;
    this.mesh.material = texturedFacingPlaneMat;

    this.draw(url);
  }
  draw(url: string) {
    var ctx = this.dynamicTexture.getContext();
    var img = new Image();
    img.src = url;
    console.log(img, url);
    const self = this;
    img.onload = function () {
      ctx.drawImage(this, 0, 0);
      self.dynamicTexture.update();
    }
  }
}

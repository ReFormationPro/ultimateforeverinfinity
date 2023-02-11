import {
  Scene,
  Mesh,
  MeshBuilder,
  Vector3,
  Color3,
  StandardMaterial,
  Ray,
  RayHelper,
  Quaternion
} from "babylonjs";
import EntityObject from "./EntityObject";
import Player from "./Player";

export class Collider extends EntityObject {
  obj: EntityObject;
  //4 Physics
  collided: boolean = false;
  highlightColor: Color3;
  constructor(
    scene: Scene,
    position: Vector3 = Vector3.Zero(),
    up: Vector3 = null,
    target: Vector3 = null,
    highlightColor: Color3 = null
  ) {
    super(scene, "collider", position, up, target);
    this.highlightColor = highlightColor;
  }
  createMaterialIfNull() {
    if (this.mesh.material === undefined || this.mesh.material === null) {
      const colliderMat = new StandardMaterial(`MeshMaterial${EntityObject.index}`, this.scene);
      if (this.highlightColor === null) {
        colliderMat.alpha = 0;
      }
      else {
        colliderMat.diffuseColor = this.highlightColor;
        colliderMat.alpha = 0.1;
        colliderMat.wireframe = true;
      }
      this.mesh.material = colliderMat;
    }
  }
  setPosition() {
    this.mesh.position = this.position;
  }
  activate() {
    this.setPosition();
    this.createMaterialIfNull();
  }
  createMesh() { }
}

export class JumpCollider extends Collider {
  ray: Ray;
  rayHelper: RayHelper;
  height: number;

  onObject: boolean = false;
  static LAMBDA = 0.01;
  // Rising threshold in seconds
  risingDuration: number;
  time: number;
  constructor(
    scene: Scene,
    height: number,
    highlightColor: Color3 = null,
    position: Vector3 = Vector3.Zero(),
    up: Vector3 = null,
    target: Vector3 = null,
    risingDuration: number = 5
  ) {
    super(scene, position, up, target, highlightColor);
    this.height = height;
    this.risingDuration = risingDuration * 1000;
    this.time = 0;
  }

  callbackOnRisingDurationComplete(deltaTime: number, callback: () => void,) {
    this.time += deltaTime;
    if (this.time >= this.risingDuration) {
      callback();
      this.time = 0;
    }
  }

  addRayDown() {
    this.ray = new Ray();
    this.rayHelper = new RayHelper(this.ray);
    this.rayHelper.attachToMesh(
      this.obj.mesh,
      this.obj.gravity,
      Vector3.Zero(),
      (this.height / 2) + JumpCollider.LAMBDA
    );
    if (this.highlightColor !== null) {
      this.rayHelper.show(this.scene, this.highlightColor);
    }

    this.scene.onBeforeRenderObservable.add(() => {
      const pick = this.scene.pickWithRay(this.ray);
      if (pick) {
        this.onObject = pick.hit;
        // console.log(`this.onObject: ${this.onObject}`);
      }
    });
  }
  createMesh() {
    this.addRayDown();
  }
  align() {
    // this.mesh.rotationQuaternion = (
    //   this.negTarget === null ||
    //   this.v === null
    // ) ? Quaternion.Identity() : this.alignMatrix();
  }
}

export class BoxCollider extends JumpCollider {
  width: number;
  depth: number;

  constructor(
    scene: Scene,
    width: number,
    height: number,
    depth: number,
    highlightColor: Color3 = null,
    position: Vector3 = Vector3.Zero(),
    up: Vector3 = null,
    target: Vector3 = null,
  ) {
    super(scene, height, highlightColor, position, up, target);

    this.width = width;
    this.depth = depth;
  }
  createMesh() {
    super.createMesh();
    this.mesh = MeshBuilder.CreateBox(this.name, {
      width: this.width,
      height: this.height,
      depth: this.depth
    });

    this.mesh.isPickable = false;
  }
}

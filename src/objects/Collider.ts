import {
  Scene,
  Mesh,
  MeshBuilder,
  Vector3,
  Color3,
  StandardMaterial,
  Ray,
  RayHelper
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
    position: Vector3 = null,
    rotation: Vector3 = null,
    highlightColor: Color3 = null
  ) {
    super(scene, "collider", position, rotation);
    this.highlightColor = highlightColor;
  }
  createMaterialIfNull() {
    if (this.mesh.material === undefined || this.mesh.material === null) {
      const colliderMat = new StandardMaterial("Mesh Material", this.scene);
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
  activate() {
    this.createMaterialIfNull();
  }
  createMesh() { }
  setMeshPosition() { }
}

export class JumpCollider extends Collider {
  ray: Ray;
  rayHelper: RayHelper;
  height: number;

  onObject: boolean = false;
  static LAMBDA = 0.01;

  constructor(
    scene: Scene,
    height: number,
    position: Vector3 = null,
    rotation: Vector3 = null,
    highlightColor: Color3 = null,
  ) {
    super(scene, position, rotation, highlightColor);
    this.height = height;
  }

  addRayDown() {
    this.ray = new Ray();
    this.rayHelper = new RayHelper(this.ray);
    this.rayHelper.attachToMesh(
      this.obj.mesh,
      Vector3.Down(),
      new Vector3(0, -JumpCollider.LAMBDA, 0),
      this.height / 2
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
}

export class BoxCollider extends JumpCollider {
  width: number;
  depth: number;

  constructor(
    scene: Scene,
    width: number,
    height: number,
    depth: number,
    position: Vector3 = null,
    rotation: Vector3 = null,
    highlightColor: Color3 = null,
  ) {
    super(scene, height, position, rotation, highlightColor);

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
  setMeshPosition() {
    this.mesh.position = (this.position === null) ? Vector3.Zero() : this.position;
  }
}

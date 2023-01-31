import { AssetsManager, Camera, DynamicTexture, ISpriteJSONAtlas, Material, Matrix, Mesh, PhysicsImpostor, SpriteMap, StandardMaterial, TextFileAssetTask, Texture, Vector2 } from "babylonjs";
import { Scene, Vector3 } from "babylonjs";
import Player from "./Player";
import { BoxCollider, Collider, JumpCollider } from "./Collider";
import UFICamera from "./UFICamera";
import { FPS_COUNT_ } from "../globals";
import { UFICommand } from "../controllers/Controller";
// All EntityObject instances can move
export default class EntityObject {
  mesh: Mesh = undefined;
  compoundMesh: Mesh = undefined;
  cam: UFICamera = undefined;
  collider: Collider = undefined;
  texture: Texture = undefined;
  material: Material = undefined;
  spriteMap: SpriteMap = undefined;

  name: string;
  static index = 0;
  scene: Scene;
  //v is the unit up vector
  initialUpVector: Vector3 = Vector3.Up();
  //frame times in seconds
  frameTime: number = undefined;
  prevFrameTime: number = undefined;
  //speed units per second
  speed: number;
  jumpSpeed: number;
  //units per meter
  static unitsPerMeter: number = 100;
  //
  position: Vector3;
  rotation: Vector3;
  //physics
  //https://grideasy.github.io/tutorials/Using_The_Physics_Engine#impostors
  static GROUND_HEIGHT: number = 0;

  supportsPhysics: Boolean = false;

  constructor(
    scene: Scene,
    prefix: string,
    position: Vector3 = Vector3.Zero(),
    rotation: Vector3 = Vector3.Zero()
  ) {
    this.scene = scene;
    this.name = `${prefix}${EntityObject.index++}`;
    this.position = position;
    this.rotation = rotation;
  }
  createCompundMesh() {
    // console.log(this.position);
    this.compoundMesh = new Mesh("", this.scene);
    this.compoundMesh.position = this.position;
    this.compoundMesh.rotation = this.rotation;
    this.compoundMesh.addChild(this.mesh);
  }
  setCamera(camera: UFICamera) {
    this.cam = camera;
    this.cam.obj = this;
    const camMesh: Mesh = new Mesh("camera", this.scene);
    this.compoundMesh.addChild(camMesh);
    camMesh.position = Vector3.Zero();
    this.cam.camObj.lockedTarget = camMesh;
  }
  setTexture(
    url: string,
    noMipMaps: boolean = false,
    samplingMode: number = Texture.NEAREST_NEAREST
  ) {
    console.log(url);
    // Load the spritesheet (with appropriate settings) associated with the JSON Atlas.
    this.texture = new Texture(url, this.scene,
      noMipMaps, //NoMipMaps
      false, //InvertY usually false if exported from TexturePacker
      samplingMode, //Sampling Mode
      null, //Onload, you could spin up the sprite map in a function nested here
      null, //OnError
      null, //CustomBuffer
      false, //DeleteBuffer
      BABYLON.Engine.TEXTURETYPE_RGBA //ImageFormageType RGBA
    );
  }
  async mapSprites(
    atlasJSON: ISpriteJSONAtlas,
    maxAnimationFrames = 2
  ) {
    this.spriteMap = new SpriteMap(
      `${this.name}SpriteMap`,
      atlasJSON, this.texture, {
      maxAnimationFrames: maxAnimationFrames,
      stageSize: new Vector2(1, 1),
      flipU: true
    }, this.scene
    )
  }
  drawSprite(spriteIndex: number = 0) {
    this.spriteMap.changeTiles(0, new Vector2(0, 0), spriteIndex)
  }
  setDynamicTexture(
    width: number = 64,
    height: number = width,
    generateMipMaps: boolean = true,
    samplingMode: number = Texture.NEAREST_NEAREST
  ) {
    this.material = new StandardMaterial(
      `${this.name}Material`,
      this.scene
    );

    this.texture = new DynamicTexture(
      `${this.name}Texture`,
      { width: width, height: height },
      this.scene,
      generateMipMaps,
      samplingMode
    );

    const stdMat = <StandardMaterial>this.material;
    stdMat.diffuseTexture = this.texture;
    stdMat.diffuseTexture.hasAlpha = true;
    // stdMat.backFaceCulling = true;
    this.mesh.material = stdMat;
  }
  drawDynamicTexture(url: string) {
    console.log(url);
    const dynamicTexture = <DynamicTexture>this.texture

    var ctx = dynamicTexture.getContext();
    var img = new Image();
    img.src = url;
    // console.log(img, url);
    const self = this;
    img.onload = function () {
      ctx.drawImage(this, 0, 0);
      dynamicTexture.update();
    }
  }
  setCollider(collider: Collider, isFacingCamera: boolean = true) {
    this.collider = collider;
    this.collider.obj = this;
    this.collider.createMesh();
    if (this.collider.mesh !== null) {
      this.compoundMesh.addChild(this.collider.mesh);
      this.collider.setMeshPosition();
      if (isFacingCamera) {
        this.compoundMesh.billboardMode = Mesh.BILLBOARDMODE_Y;
      }
      this.collider.activate();
    }
  }
  addPhysics(mass: number = 0, restitution: number = 0, friction: number = 0) {
    this.mesh.physicsImpostor = new PhysicsImpostor(
      this.mesh,
      PhysicsImpostor.BoxImpostor,
      { mass: 0, restitution: 0 }
    );
    if (this.collider !== undefined && this.collider.mesh !== undefined) {
      this.collider.mesh.physicsImpostor = new PhysicsImpostor(
        this.collider.mesh,
        PhysicsImpostor.BoxImpostor,
        { mass: 0, restitution: 0 }
      );
    }
    this.compoundMesh.physicsImpostor = new PhysicsImpostor(
      this.compoundMesh,
      PhysicsImpostor.BoxImpostor,
      { mass: mass, restitution: restitution, friction: friction }
    );
    //this removes the shaky behavior
    this.compoundMesh.physicsImpostor.physicsBody.angularDamping = 1;
  }
  calcDeltaTime() {
    this.prevFrameTime = this.frameTime;
    this.frameTime = Date.now() / 1000;
    if (this.prevFrameTime === undefined) {
      this.prevFrameTime = this.frameTime;
      return;
    }
    return this.frameTime - this.prevFrameTime;
  }
  calcBackwardVector(negTarget: Vector3, yZero: boolean = true) {
    const resVec: Vector3 = negTarget.subtract(this.compoundMesh.position);
    resVec.y = 0;
    return resVec.normalize();
  }
  calcRightVector(backward: Vector3, up: Vector3): Vector3 {
    return Vector3.Cross(up, backward);
  }
  calcAnOrthogonal(forwardVector: Vector3) {
    const resVec: Vector3 = Vector3.Zero(),
      unitResVec: Vector3 = Vector3.Zero();
    resVec.x = forwardVector.z;
    resVec.y = 0;
    resVec.z = -forwardVector.x;
    resVec.normalizeToRef(unitResVec);
    return unitResVec;
  }
  calcAxesRef(negTarget: Vector3, up: Vector3) {
    const w = this.calcBackwardVector(negTarget);
    const v = up;
    const u = this.calcRightVector(w, v);
    return [u, v, w]
  }
  alignUvw(negTarget: Vector3, upVector: Vector3 = null) {
    // TODO: Complete this
    const backwardVector = this.calcBackwardVector(negTarget);
    if (upVector === null) {
      upVector = this.calcAnOrthogonal(backwardVector)
    }
    const [u, v, w] = this.calcAxesRef(negTarget, upVector);

    // Inverse of the alignment matrix, which is orthogonal
    const matrix: Matrix = Matrix.FromArray([
      u.x, u.y, u.z, 0,
      v.x, v.y, v.z, 0,
      w.x, w.y, w.z, 0,
      0, 0, 0, 1
    ]);
  }
  move(command: UFICommand) {
    const deltaTime = this.calcDeltaTime();
    const [u, v, w] = this.calcAxesRef(command.negTarget, command.up);

    // console.log(`u: ${u}`);
    // console.log(`v: ${v}`);
    // console.log(`w: ${w}`);

    const unitDisplacementRight: Vector3 = u.multiplyByFloats(
      -command.displacement.x,
      -command.displacement.x,
      -command.displacement.x
    );
    const unitDisplacementUp: Vector3 = v.multiplyByFloats(
      command.displacement.y,
      command.displacement.y,
      command.displacement.y
    );
    const unitDisplacementForward: Vector3 = w.multiplyByFloats(
      -command.displacement.z,
      -command.displacement.z,
      -command.displacement.z
    );

    const unitDirection = unitDisplacementRight.add(
      unitDisplacementUp.add(unitDisplacementForward)
    ).normalize();


    const frameSpeed = (this.speed * EntityObject.unitsPerMeter) / FPS_COUNT_;
    const frameJumpSpeed = (this.jumpSpeed * EntityObject.unitsPerMeter) / FPS_COUNT_;

    if (this.compoundMesh.physicsImpostor === undefined) {
      const displacementNorm = frameSpeed * deltaTime;
      const displacement: Vector3 = new Vector3(
        displacementNorm,
        displacementNorm,
        displacementNorm
      );
      this.compoundMesh.position.addInPlace(displacement.multiply(unitDirection))
    }
    else {
      const velocity: Vector3 = new Vector3(
        frameSpeed,
        0,
        frameSpeed
      );
      const jumpVelocity: Vector3 = new Vector3(
        0,
        frameJumpSpeed,
        0
      );

      const jumpCollider: JumpCollider = <JumpCollider>this.collider;
      if (jumpCollider === undefined) {
        throw TypeError("jumpCollider is undefined");
      }
      // console.log(`jumpCollider.onObject: ${jumpCollider.onObject}`);

      if (command.displacement.y !== 0 && (jumpCollider.onObject || command.test)) {
        this.compoundMesh.physicsImpostor.setLinearVelocity(jumpVelocity.multiply(unitDirection));
        jumpCollider.onObject = false;
      }
      else {
        this.compoundMesh.physicsImpostor.setLinearVelocity(velocity.multiply(unitDirection));
      }
    }
  }
}

import { AssetsManager, Camera, DynamicTexture, Engine, ISpriteJSONAtlas, Material, Matrix, Mesh, PhysicsImpostor, SpriteMap, StandardMaterial, TextFileAssetTask, Texture, Vector2 } from "babylonjs";
import { Scene, Vector3 } from "babylonjs";
import Player from "./Player";
import { BoxCollider, Collider, JumpCollider } from "./Collider";
import UFICamera from "./UFICamera";
import { FPS_COUNT_ } from "../globals";
import { UFICommand } from "../controllers/Controller";
import BaseScene from "../scenes/BaseScene";
import UFITimer from "../time/UFITimer";
import UFIAnimation from "../time/UFIAnimation";
// All EntityObject instances can move
export default class EntityObject {
  mesh: Mesh = undefined;
  compoundMesh: Mesh = undefined;
  cam: UFICamera = undefined;
  collider: Collider = undefined;
  texture: Texture = undefined;
  material: Material = undefined;
  spriteMap: SpriteMap = undefined;
  timer: UFITimer = undefined;

  name: string;
  static index = 0;
  scene: Scene;
  //v is the unit up vector
  initialUpVector: Vector3 = Vector3.Up();
  //frame times in seconds
  frameTime: number = undefined;
  prevFrameTime: number = undefined;
  //speed 
  speed: number = undefined;
  jumpSpeed: number = undefined;
  jumpCount: number = undefined;
  jumpsLeft: number = undefined;
  //
  position: Vector3;
  rotation: Vector3;
  //physics
  //https://grideasy.github.io/tutorials/Using_The_Physics_Engine#impostors
  static GROUND_HEIGHT: number = 0;

  supportsPhysics: Boolean = false;
  //animation
  animations: Array<UFIAnimation> = [];
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
    this.timer = new UFITimer(scene);
    // this.timer = new UFITimer(scene, true, 3, () => undefined, "cuckold");
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
    obj: Blob | MediaSource,
    samplingMode: number = Texture.NEAREST_NEAREST
  ) {
    // Load the spritesheet (with appropriate settings) associated with the JSON Atlas.
    this.texture = new Texture(
      "../../demoassets/player/spritesheet.png",
      this.scene,
      false, //NoMipMaps
      false, //InvertY usually false if exported from TexturePacker
      samplingMode, //Sampling Mode
      () => console.log("Load successful"), //Onload, you could spin up the sprite map in a function nested here
      (msg: string, e: any) => console.log(msg, e), //OnError
      null, //CustomBuffer
      false, //DeleteBuffer
      Engine.TEXTUREFORMAT_RGBA //ImageFormageType RGBA
    );
  }
  async mapSprites(
    atlasJSON: ISpriteJSONAtlas,
    maxAnimationFrames = 2
  ) {

    // this.assetsManager = new AssetsManager(this.scene);
    // const textTask = assetsManager.addTextFileTask("text task", "textures/spriteMap/none_trimmed/Legends_Level_A.json");

    this.spriteMap = new SpriteMap(
      `${this.name}SpriteMap`,
      atlasJSON,
      this.texture,
      {
        maxAnimationFrames: maxAnimationFrames,
        stageSize: new Vector2(1, 1),
        flipU: true
      },
      this.scene
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
    // console.log(url);
    const dynamicTexture = <DynamicTexture>this.texture

    var ctx = dynamicTexture.getContext();
    var img = new Image();
    img.src = url;
    // console.log(img, url);
    const self = this;
    img.onload = function () {
      const txtSize = self.texture.getSize()
      ctx.clearRect(0, 0, txtSize.width, txtSize.height);
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
  addAnimation(animation: UFIAnimation | object) {
    if (animation instanceof (UFIAnimation)) {
      animation.obj = this;
      this.animations.push(animation);
    }
    else if (animation instanceof (Array)) {
      for (const anim of animation) {
        anim.obj = this;
      }
      this.animations = animation;
    }
  }
  stopAllAnimationsExcept(anim: UFIAnimation) {
    for (const animation of this.animations) {
      this.startIfEqual(anim, animation);
    }
  }
  startIfEqual(anim1: UFIAnimation, anim2: UFIAnimation) {
    if (anim1 === anim2) {
      anim2.start()
    }
    else {
      anim2.stop()
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
  calcBackwardVector(negTarget: Vector3, yZero: boolean = true) {

    const resVec: Vector3 = negTarget.subtract(this.compoundMesh.position);
    if (yZero) {
      resVec.y = 0;
    }
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
  calcVelocityOnUWPlane(displacement: Vector3, u: Vector3, w: Vector3) {
    const directionLeft: Vector3 = u.multiplyByFloats(
      displacement.x,
      displacement.x,
      displacement.x
    );
    const directionBackward: Vector3 = w.multiplyByFloats(
      displacement.z,
      displacement.z,
      displacement.z
    );

    return directionLeft.add(directionBackward).negate().normalize().multiplyByFloats(
      this.speed,
      this.speed,
      this.speed
    );
  }
  calcVelocityOnV(displacement: Vector3, v: Vector3) {
    const directionUp: Vector3 = v.multiplyByFloats(
      displacement.y,
      displacement.y,
      displacement.y
    )
    return directionUp.multiplyByFloats(
      this.jumpSpeed,
      this.jumpSpeed,
      this.jumpSpeed
    )
  }
  move(command: UFICommand) {
    // console.log(`displacement gravity physicsEnabled: ${command.displacement} ${this.scene.gravity} ${this.scene.physicsEnabled}`);

    const deltaTime = this.timer.calcDeltaTime();
    if (deltaTime === undefined) {
      return;
    }
    const [u, v, w] = this.calcAxesRef(command.negTarget, command.up);
    const velocityOnUWPlane = this.calcVelocityOnUWPlane(command.displacement, u, w);
    const velocityOnV = this.calcVelocityOnV(command.displacement, v);

    if (!this.scene.physicsEnabled) {
      const velocity = velocityOnUWPlane.add(velocityOnV);
      const displacement = velocity.multiplyByFloats(
        deltaTime * 100,
        deltaTime * 100,
        deltaTime * 100
      )
      this.compoundMesh.position.addInPlace(displacement);
    }
    else {
      const jumpCollider: JumpCollider = <JumpCollider>this.collider;
      if (jumpCollider === undefined) {
        throw TypeError("jumpCollider is undefined");
      }
      if (jumpCollider.onObject || (command.test && command.gravity.equals(Vector3.Zero()))) {
        this.jumpsLeft = this.jumpCount;
      }
      if (this.jumpsLeft > 0 && command.displacement.y !== 0) {
        --this.jumpsLeft;
        this.compoundMesh.physicsImpostor.wakeUp();
        this.compoundMesh.physicsImpostor.setLinearVelocity(velocityOnV);
        jumpCollider.onObject = false;
      }
      else if (command.displacement.x !== 0 || command.displacement.z !== 0) {
        this.compoundMesh.physicsImpostor.wakeUp();
        const currVelocity = this.compoundMesh.physicsImpostor.getLinearVelocity();
        currVelocity.x = 0;
        currVelocity.z = 0;
        this.compoundMesh.physicsImpostor.setLinearVelocity(velocityOnUWPlane.add(currVelocity));
      }
      else {
        if (jumpCollider.onObject || (command.test && command.gravity.equals(Vector3.Zero()))) {
          this.compoundMesh.physicsImpostor.sleep();
        }
        if (command.test && !command.gravity.equals(Vector3.Zero())) {
          this.compoundMesh.physicsImpostor.wakeUp();
        }
        const currVelocity = this.compoundMesh.physicsImpostor.getLinearVelocity();
        currVelocity.x = 0;
        currVelocity.z = 0;
        this.compoundMesh.physicsImpostor.setLinearVelocity(currVelocity);
      }
    }
  }
}
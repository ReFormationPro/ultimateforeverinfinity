import { Camera, Mesh, PhysicsImpostor } from "babylonjs";
import { Scene, Vector3 } from "babylonjs";
import Player from "./Player";
import { BoxCollider, Collider, JumpCollider } from "./Collider";
import UFICamera from "./Camera";
import { FPS_COUNT_ } from "../globals";
import UFIAnimation from "./UFIAnimation";
import { UFICommand } from "../controllers/Controller";
// All EntityObject instances can move
export default class EntityObject {
  mesh: Mesh = undefined;
  compoundMesh: Mesh = undefined;
  cam: UFICamera = undefined;
  collider: Collider = undefined;
  animation: UFIAnimation = undefined;


  name: string;
  static index = 0;
  scene: Scene;
  //v is the unit up vector
  v: Vector3 = Vector3.Up();
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
    console.log(this.position);
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
  setAnimation(animation: UFIAnimation) {
    this.animation = animation;
    this.animation.obj = this;
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
  //children should implement these
  calcRelativeAxes(): Array<Vector3> {
    return [Vector3.Zero(), Vector3.Zero(), Vector3.Zero()];
  }
  move(command: UFICommand) {
    const deltaTime = this.calcDeltaTime();
    const [u, v, w] = this.calcRelativeAxes();

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

      if (unitDirection.y !== 0 && jumpCollider.onObject) {
        this.compoundMesh.physicsImpostor.setLinearVelocity(new Vector3(0, 58.8, 0));
        jumpCollider.onObject = false;
      }
      else {
        this.compoundMesh.physicsImpostor.setLinearVelocity(velocity.multiply(unitDirection));
      }
    }
  }
  draw(url: string) { }
}

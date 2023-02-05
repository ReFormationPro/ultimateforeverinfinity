import { Scene, Vector3 } from "babylonjs";
import PlayerController from "./PlayerController";
import UFIAnimation from "../time/UFIAnimation";

export default class AnimatedController extends PlayerController {
    idle: boolean = true;
    noIdleAnim: boolean = undefined;
    idleAnim: UFIAnimation = undefined;
    walkingFAnim: UFIAnimation = undefined;
    walkingBAnim: UFIAnimation = undefined;
    walkingLAnim: UFIAnimation = undefined;
    walkingRAnim: UFIAnimation = undefined;
    constructor(
        scene: Scene,
        canvas: any,
        idleRange: Array<string>,
        walkingFRange: Array<string>,
        walkingBRange: Array<string>,
        walkingLRange: Array<string>,
        walkingRRange: Array<string>,
    ) {
        super(scene, canvas);
        this.idleAnim = new UFIAnimation(scene, idleRange, 1);
        this.walkingFAnim = new UFIAnimation(scene, walkingFRange, 1);
        this.walkingBAnim = new UFIAnimation(scene, walkingBRange, 1);
        this.walkingLAnim = new UFIAnimation(scene, walkingLRange, 1);
        this.walkingRAnim = new UFIAnimation(scene, walkingRRange, 1);
    }
    listenInput() {
        const inputMap = this.inputMapQueue[0];
        this.command.displacement = Vector3.Zero();
        this.idle = true;
        if (inputMap["w"]) {
            this.command.displacement.addInPlace(Vector3.Forward());
            this.stopAllAnimationsExcept(this.walkingFAnim);
            this.idle = false;
        }
        if (inputMap["a"]) {
            this.command.displacement.addInPlace(Vector3.Left());
            this.stopAllAnimationsExcept(this.walkingLAnim);
            this.idle = false;
        }
        if (inputMap["s"]) {
            this.command.displacement.addInPlace(Vector3.Backward());
            this.stopAllAnimationsExcept(this.walkingBAnim);
            this.idle = false;
        }

        if (inputMap["d"]) {
            this.command.displacement.addInPlace(Vector3.Right());
            this.stopAllAnimationsExcept(this.walkingRAnim);
            this.idle = false;
        }
        if (inputMap[" "]) {
            this.command.displacement.addInPlace(Vector3.Up());
            this.stopAllAnimationsExcept(this.idleAnim);
            this.idle = false;
        }
        if (this.idle) {
            this.stopAllAnimationsExcept(this.idleAnim);
        }
        this.inputMapQueue.unshift(inputMap);

        this.move();
    }
    stopAllAnimationsExcept(anim: UFIAnimation) {
        this.startIfEqual(anim, this.idleAnim);
        this.startIfEqual(anim, this.walkingFAnim);
        this.startIfEqual(anim, this.walkingBAnim);
        this.startIfEqual(anim, this.walkingLAnim);
        this.startIfEqual(anim, this.walkingRAnim);
    }
    startIfEqual(anim1: UFIAnimation, anim2: UFIAnimation) {
        if (anim1 === anim2) {
            anim2.start()
        }
        else {
            anim2.stop()
        }
    }
}
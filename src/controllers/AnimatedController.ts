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
        idleRange: Array<string>,
        walkingFRange: Array<string>,
        walkingBRange: Array<string>,
        walkingLRange: Array<string>,
        walkingRRange: Array<string>,
    ) {
        super(scene);
        this.idleAnim = new UFIAnimation(scene, idleRange, 0);
        this.walkingFAnim = new UFIAnimation(scene, walkingFRange, 1);
        this.walkingBAnim = new UFIAnimation(scene, walkingBRange, 1);
        this.walkingLAnim = new UFIAnimation(scene, walkingLRange, 1);
        this.walkingRAnim = new UFIAnimation(scene, walkingRRange, 1);
    }
    listenInput(inputMap: object) {
        if (inputMap["w"]) {
            this.command.displacement.addInPlace(Vector3.Forward());
            this.player.stopAllAnimationsExcept(this.walkingFAnim);
            this.idle = false;
        }
        if (inputMap["a"]) {
            this.command.displacement.addInPlace(Vector3.Left());
            this.player.stopAllAnimationsExcept(this.walkingLAnim);
            this.idle = false;
        }
        if (inputMap["s"]) {
            this.command.displacement.addInPlace(Vector3.Backward());
            this.player.stopAllAnimationsExcept(this.walkingBAnim);
            this.idle = false;
        }
        if (inputMap["d"]) {
            this.command.displacement.addInPlace(Vector3.Right());
            this.player.stopAllAnimationsExcept(this.walkingRAnim);
            this.idle = false;
        }
        if (inputMap[" "]) {
            this.command.displacement.addInPlace(Vector3.Up());
            // this.player.stopAllAnimationsExcept(this.idleAnim);
            this.idle = false;
        }
        if (this.idle) {
            this.player.stopAllAnimationsExcept(this.idleAnim);
        }
    }
}
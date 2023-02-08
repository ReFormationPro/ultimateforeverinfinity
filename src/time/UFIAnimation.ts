import { Scene } from "babylonjs";
import EntityObject from "../objects/EntityObject";
import UFITimer from "./UFITimer";

export default class UFIAnimation {
    obj: EntityObject;
    range: Array<string>;
    timer: UFITimer = undefined;
    scene: Scene;
    index: number = 0;
    delayInSeconds: number = undefined;
    constructor(
        scene: Scene,
        range: Array<string>,
        secondsBetweenFrames: number
    ) {
        this.range = range;
        this.scene = scene;
        this.delayInSeconds = secondsBetweenFrames;
    }

    animateNextFrame() {
        // console.log(this);
        this.obj.drawDynamicTexture(this.range[this.index]);
        this.index = (this.index + 1) % this.range.length;
    }
    start() {
        if (this.timer === undefined) {
            this.timer = new UFITimer(
                this.scene,
                false,
                this.delayInSeconds,
                true,
                this.animateNextFrame.bind(this),
            );
        }
        this.timer.enable();
    }
    stop() {
        if (this.timer !== undefined) {
            this.timer.disable();
        }
    }
}
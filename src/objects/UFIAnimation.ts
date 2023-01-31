import { FPS_COUNT_, TIME_STEP_ } from "../globals";
import EntityObject from "./EntityObject";

class UFIAnimation {
    range: Array<string>;
    //timeStep or latency threshold
    timeStepThreshold: number;
    cycle: boolean;

    time: number;
    index: number;
    constructor(
        range: Array<string>,
        framesPerKeyFrame: number = FPS_COUNT_ / range.length,
        cycle: boolean = true
    ) {
        this.range = range;
        this.timeStepThreshold = framesPerKeyFrame * TIME_STEP_;
        this.cycle = cycle;
        this.index = 0;
        this.time = 0;
    }

    animateFrame(deltaTime: number, obj: EntityObject) {
        if (this.index >= this.range.length && !this.cycle) return;
        else if (this.cycle) {
            this.index = 0;
            this.time = 0;
        }
        this.time += deltaTime;
        if (this.time >= this.timeStepThreshold) {
            obj.draw(this.range[this.index++]);
        }
    }
}

export default class UFIAnimationManager {
    anims: object = {};
    constructor(
        ranges: object,
        baseUrl: string,
        framesPerKeyFrame: number = null,
        cycle: boolean = true
    ) {
        const entries_: Array<Array<any>> = Object.entries(ranges);
        for (const [name, range] of entries_) {
            // console.log(ranges[name])
            if (framesPerKeyFrame === null) {
                framesPerKeyFrame = FPS_COUNT_ / range.length;
            }
            const newRange = range.map((baseName: String) => `${baseUrl}/${baseName}`);
            this.anims[name] = new UFIAnimation(newRange, framesPerKeyFrame, cycle);
        }
        // console.log(this.anims)
    }
}
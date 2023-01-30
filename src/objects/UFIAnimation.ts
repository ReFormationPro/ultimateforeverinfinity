import { FPS_COUNT_, TIME_STEP_ } from "../globals";
import EntityObject from "./EntityObject";


export default class UFIAnimation {
    range: Array<string>;
    //timeStep or latency threshold
    timeStepThreshold: number;
    cycle: boolean;
    obj: EntityObject;

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

    renderKeyFrame(deltaTime: number) {
        if (this.index >= this.range.length && !this.cycle) return;
        else if (this.cycle) {
            this.index = 0;
            this.time = 0;
        }
        this.time += deltaTime;
        if (this.time >= this.timeStepThreshold) {
            this.obj.draw(this.range[this.index++]);
        }
    }
}
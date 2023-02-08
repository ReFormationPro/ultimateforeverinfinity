import { Scene, MeshBuilder } from "babylonjs";
import EntityObject from "./EntityObject";
export default class UFISphere extends EntityObject {
    scene: Scene;
    diameter: number;
    segments: number;

    constructor(scene: Scene, diameter: number = undefined, segments: number = undefined) {
        super(scene, "sphere");
        this.diameter = diameter;
        this.segments = segments;
        this.createMesh();
    }
    createMesh() {
        this.mesh = MeshBuilder.CreateSphere(
            this.name,
            { diameter: this.diameter, segments: this.segments },
            this.scene
        );
        this.createCompundMesh();
    }
}

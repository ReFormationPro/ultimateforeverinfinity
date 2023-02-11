import { Scene, MeshBuilder, Vector3 } from "babylonjs";
import EntityObject from "./EntityObject";
export default class UFISphere extends EntityObject {
    scene: Scene;
    diameter: number;
    segments: number;

    constructor(
        scene: Scene,
        diameter: number = undefined,
        segments: number = undefined,
        position: Vector3 = Vector3.Zero(),
        up: Vector3 = Vector3.Up(),
        target: Vector3 = Vector3.Forward(),
    ) {
        super(scene, "sphere", position, up, target);
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

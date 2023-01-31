import { Vector3 } from "babylonjs";
import EntityObject from "./objects/EntityObject";
import PLAYER_IMG_DIR from "../demoassets/player/player_02.png";
import SPRITESHEET_DIR from "../demoassets/sokoban/spritesheet.json";

const PLAYER_DIR = "../../demoassets/player"
const FPS_COUNT_: number = 60;
//Time step or latency
const TIME_STEP_: number = 1 / FPS_COUNT_;
const GRAVITY = new Vector3(0, -9.8 * FPS_COUNT_, 0)
export { FPS_COUNT_, GRAVITY, PLAYER_IMG_DIR, PLAYER_DIR, SPRITESHEET_DIR, TIME_STEP_ };

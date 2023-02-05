import { Vector3 } from "babylonjs";
import EntityObject from "./objects/EntityObject";
import SPRITESHEET_DIR from "../demoassets/player/spritesheet.png";
import SPRITESHEET_MAP_DIR from "../demoassets/player/spritesheet.json";

import PLAYER_IDLE from "../demoassets/player/player_02.png";
import PLAYER_WALKING_F1 from "../demoassets/player/player_03.png";
import PLAYER_WALKING_F2 from "../demoassets/player/player_04.png";
import PLAYER_WALKING_B1 from "../demoassets/player/player_01.png";
import PLAYER_WALKING_B2 from "../demoassets/player/player_24.png";
import PLAYER_WALKING_R1 from "../demoassets/player/player_12.png";
import PLAYER_WALKING_R2 from "../demoassets/player/player_13.png";
import PLAYER_WALKING_L1 from "../demoassets/player/player_15.png";
import PLAYER_WALKING_L2 from "../demoassets/player/player_16.png";

// const SPRITESHEET_MAP_DIR = "demoassets/player/spritesheet.json"
const FPS_COUNT_: number = 60;
//Time step or latency
const TIME_STEP_: number = 1 / FPS_COUNT_;
const GRAVITY = new Vector3(0, -9.8, 0)
export {
    FPS_COUNT_,
    TIME_STEP_,
    GRAVITY,
    SPRITESHEET_DIR,
    SPRITESHEET_MAP_DIR,
    PLAYER_IDLE,
    PLAYER_WALKING_F1,
    PLAYER_WALKING_F2,
    PLAYER_WALKING_B1,
    PLAYER_WALKING_B2,
    PLAYER_WALKING_R1,
    PLAYER_WALKING_R2,
    PLAYER_WALKING_L1,
    PLAYER_WALKING_L2
};

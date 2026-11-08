import { BoardUnit } from "./card";

export type LaneType = "HEIGHTS" | "GROUND" | "WATER";

export interface GameLane {
  index: number;
  type: LaneType;
  plantUnit: BoardUnit | null;
  zombieUnit: BoardUnit | null;
}

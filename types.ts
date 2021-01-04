export type Direction = 'up' | 'down' | 'left' | 'right'

export interface Coordinates
{
    x: number;
    y: number;
}

export interface StreamSlot {
    isActive: boolean,
    withSound: boolean | null,
    withVideo: boolean | null,
    userId: string | null,
}

export interface Room
{
    id: string;
    scale: number;
    grid: number[];
    originCoordinates: Coordinates;
    backgroundImageUrl: string;
    spawnPoint: {
        x: number;
        y: number;
        direction: Direction;
    };
    objects: {
        x: number;
        y: number;
        url: string;
    }[];
    sit: number[][];
    blocked: Coordinates[];
    doors: {
        x: number,
        y: number,
        targetRoomId: string,
        targetX: number,
        targetY: number
    }[];
    streams: StreamSlot[];
    // users: Player[]
}
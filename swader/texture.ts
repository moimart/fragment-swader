import { vec2, vec4, _vec4, RGBA } from './math';

export type textureInfo = [Uint32Array, vec2];

function nearestNeighbor(coords:vec2, size:vec2, data:Uint32Array, mode:string):RGBA {
    let rCoords: vec2 = new vec2(Math.floor(coords.x * size.x), Math.floor(coords.y * size.y));

    if (mode == "clamp") {
        rCoords.x = (rCoords.x > size.x) ? size.x : rCoords.x;
        rCoords.y = (rCoords.y > size.y) ? size.y : rCoords.y;
    } else if (mode == "repeat") {
        rCoords.x = (rCoords.x > size.x) ? (rCoords.x % size.x) : rCoords.x;
        rCoords.y = (rCoords.y > size.y) ? (rCoords.y % size.y) : rCoords.y;
    }

    let rawColor = data[rCoords.y * size.x + rCoords.x];

    return new vec4(
        rawColor & 0xff, 
        (rawColor >> 8) & 0xff, 
        (rawColor >> 16) & 0xff, 
        (rawColor >> 24) & 0xff);
}

function bilinear(coords: vec2, size: vec2, data: Uint32Array, mode: string): RGBA {
    return new vec4(1);
}

export function textureFetch(texture: textureInfo, coords: vec2, mode: string = "clamp", filtering: string = "nearest"): RGBA {
    let rgba: RGBA = new vec4();
    switch (filtering) {
        case "bilinear":
            rgba = bilinear(coords, texture[1], texture[0], mode);
        case "nearest":
        default:
            rgba = nearestNeighbor(coords, texture[1], texture[0], mode);
    }
    
    return rgba.div(255);
}


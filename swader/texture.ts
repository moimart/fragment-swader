import { vec2, vec4, _vec4, RGBA, clamp, _vec2 } from './math';

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
    let ncoords: vec2 = _vec2(coords.x,coords.y);

    if (mode == "clamp") {
        ncoords = clamp(ncoords, _vec2(0), _vec2(1));
    } else if (mode == "repeat") {
        ncoords.x = (ncoords.x > 1) ? (ncoords.x % 1) : ncoords.x;
        ncoords.y = (ncoords.y > 1) ? (ncoords.y % 1) : ncoords.y;
    }

    let _coords00: vec2 = new vec2(Math.floor(ncoords.x * size.x), Math.floor(ncoords.y * size.y));
    let _coords10: vec2 = new vec2(Math.ceil(ncoords.x * size.x), Math.floor(ncoords.y * size.y));
    let _coords01: vec2 = new vec2(Math.floor(ncoords.x * size.x), Math.ceil(ncoords.y * size.y));
    let _coords11: vec2 = new vec2(Math.ceil(ncoords.x * size.x), Math.ceil(ncoords.y * size.y));

    let dx = ncoords.x - Math.floor(ncoords.x);
    let dy = ncoords.y - Math.floor(ncoords.y);

    let _c00 = data[_coords00.y * size.x + _coords00.x];
    let _c10 = data[_coords10.y * size.x + _coords10.x];
    let _c01 = data[_coords01.y * size.x + _coords01.x];
    let _c11 = data[_coords11.y * size.x + _coords11.x];

    let c00 = new vec4(
        _c00 & 0xff,
        (_c00 >> 8) & 0xff,
        (_c00 >> 16) & 0xff,
        (_c00 >> 24) & 0xff);

    let c10 = new vec4(
        _c10 & 0xff,
        (_c10 >> 8) & 0xff,
        (_c10 >> 16) & 0xff,
        (_c10 >> 24) & 0xff);

    let c01 = new vec4(
        _c01 & 0xff,
        (_c01 >> 8) & 0xff,
        (_c01 >> 16) & 0xff,
        (_c01 >> 24) & 0xff);

    let c11 = new vec4(
        _c11 & 0xff,
        (_c11 >> 8) & 0xff,
        (_c11 >> 16) & 0xff,
        (_c11 >> 24) & 0xff);

    let _bilinear =
        (t: vec2, c00: vec4, c10: vec4, c01: vec4,
         c11: vec4) => {
            let a: vec4 = c00.mul(1 - t.x).add(c10.mul(t.x));
            let b: vec4 = c01.mul(1 - t.x).add(c11.mul(t.x));
            let r: vec4 = a.mul(1 - t.y).add(b.mul(t.y));
            return r;
        }
    
    return _bilinear(ncoords, c00, c10, c01, c11);
}

export function textureFetch(
    texture: textureInfo, 
    coords: vec2, 
    mode: string = "clamp", 
    filtering: string = "bilinear"): RGBA {

    let rgba: RGBA = new vec4();
    switch (filtering) {
        case "bilinear":
            rgba = bilinear(coords, texture[1], texture[0], mode);
            break;
        case "nearest":
        default:
            rgba = nearestNeighbor(coords, texture[1], texture[0], mode);
            break;
    }
    
    return rgba.div(255);
}


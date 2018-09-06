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
    let _coords00: vec2 = new vec2(Math.floor(coords.x * size.x), Math.floor(coords.y * size.y));
    let _coords10: vec2 = new vec2(Math.ceil(coords.x * size.x), Math.floor(coords.y * size.y));
    let _coords01: vec2 = new vec2(Math.floor(coords.x * size.x), Math.ceil(coords.y * size.y));
    let _coords11: vec2 = new vec2(Math.ceil(coords.x * size.x), Math.ceil(coords.y * size.y));

    if (mode == "clamp") {
        _coords00.x = (_coords00.x > size.x) ? size.x : _coords00.x;
        _coords00.y = (_coords00.y > size.y) ? size.y : _coords00.y;
        _coords10.x = (_coords10.x > size.x) ? size.x : _coords10.x;
        _coords10.y = (_coords10.y > size.y) ? size.y : _coords10.y;
        _coords01.x = (_coords01.x > size.x) ? size.x : _coords01.x;
        _coords01.y = (_coords01.y > size.y) ? size.y : _coords01.y;
        _coords11.x = (_coords11.x > size.x) ? size.x : _coords11.x;
        _coords11.y = (_coords11.y > size.y) ? size.y : _coords11.y;
    } else if (mode == "repeat") {
        //FIXME:
        _coords00.x = (_coords00.x > size.x) ? (_coords00.x % size.x) : _coords00.x;
        _coords00.y = (_coords00.y > size.y) ? (_coords00.y % size.y) : _coords00.y;
        _coords10.x = (_coords10.x > size.x) ? (_coords10.x % size.x) : _coords10.x;
        _coords10.y = (_coords10.y > size.y) ? (_coords10.y % size.y) : _coords10.y;
        _coords01.x = (_coords01.x > size.x) ? (_coords01.x % size.x) : _coords01.x;
        _coords01.y = (_coords01.y > size.y) ? (_coords01.y % size.y) : _coords01.y;
        _coords11.x = (_coords11.x > size.x) ? (_coords11.x % size.x) : _coords11.x;
        _coords11.y = (_coords11.y > size.y) ? (_coords11.y % size.y) : _coords11.y;
    }

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
        (tx: number, ty: number, c00: vec4, c10: vec4, c01: vec4,
         c11: vec4) => {
            let a: vec4 = c00.mul(1 - tx).add(c10.mul(tx));
            let b: vec4 = c01.mul(1 - tx).add(c11.mul(tx));
            let r: vec4 = a.mul(1 - ty).add(b.mul(ty));
            return r;
        }

    let dx = coords.x - Math.floor(coords.x);
    let dy = coords.y - Math.floor(coords.y);
    
    return _bilinear(coords.x, coords.y, c00, c10, c01, c11);
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


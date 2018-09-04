export class vec2 {
    public x: number = 0;
    public y: number = 0;

    constructor(x?: number, y?: number) {
        if (x) {
            this.x = x;
        }

        if (y) {
            this.y = y;
        }
    }

    add(p0: vec2): vec2 {
        return new vec2(this.x + p0.x, this.y + p0.y);
    }

    sub(p0: vec2): vec2 {
        return new vec2(this.x - p0.x, this.y - p0.y);
    }
}

export class vec3 extends vec2 {
    public z: number = 0;

    constructor(x?: number, y?: number, z?: number) {
        super(x, y);

        if (z) {
            this.z = z;
        }
    }

    add(p0: vec3): vec3 {
        return new vec3(this.x + p0.x, this.y + p0.y, this.z + p0.z);
    }

    sub(p0: vec3): vec3 {
        return new vec3(this.x - p0.x, this.y - p0.y, this.z - p0.z);
    }
}

export class vec4 extends vec3 {
    public w: number = 0;

    constructor(x?: number, y?: number, z?: number, w?: number) {
        super(x, y, z);

        if (w) {
            this.w = w;
        }
    }

    add(p0: vec4): vec4 {
        return new vec4(this.x + p0.x, this.y + p0.y, this.z + p0.z, this.w + p0.w);
    }

    sub(p0: vec4): vec4 {
        return new vec4(this.x - p0.x, this.y - p0.y, this.z - p0.z, this.w - p0.w);
    }
}

export type RGBA = [number, number, number, number];

export function distance(p0: any, p1: any): number {
    return length(p0.sub(p1));
}

export function length(orig: any): number {
    if (orig instanceof vec3) {
        return Math.sqrt(orig.x * orig.x + orig.y * orig.y + orig.z * orig.z);
    } else if (orig instanceof vec4) {
        return Math.sqrt(orig.x * orig.x + orig.y * orig.y + orig.z * orig.z + orig.w * orig.w);
    }

    return Math.sqrt(orig.x * orig.x + orig.y * orig.y);
}

export function clamp(p0: any, min: any, max: any): any {
    let clamped: any = null;
    if (p0 instanceof vec3) {

        clamped = new vec3();
        if (p0.x < min.x) clamped.x = min.x;
        if (p0.x > max.x) clamped.x = max.x;
        if (p0.y < min.y) clamped.y = min.y;
        if (p0.y < max.y) clamped.y = max.y;
        if (p0.z < min.z) clamped.z = min.z;
        if (p0.z < max.z) clamped.z = max.z;


    } else if (p0 instanceof vec4) {
        clamped = new vec4();
        if (p0.x < min.x) clamped.x = min.x;
        if (p0.x > max.x) clamped.x = max.x;
        if (p0.y < min.y) clamped.y = min.y;
        if (p0.y < max.y) clamped.y = max.y;
        if (p0.z < min.z) clamped.z = min.z;
        if (p0.z < max.z) clamped.z = max.z;
        if (p0.z < min.w) clamped.w = min.w;
        if (p0.z < max.w) clamped.w = max.w;
    }

    clamped = new vec2();

    if (p0.x < min.x) clamped.x = min.x;
    if (p0.y < min.y) clamped.y = min.y;
    if (p0.x > max.x) clamped.x = max.x;
    if (p0.y < max.y) clamped.y = max.y;

    return clamped;
}
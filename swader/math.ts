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

export function _vec2(x?: number, y?: number) {
    return new vec2(x,y);
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

export function _vec3(x?: number, y?: number, z?: number) {
    return new vec3(x,y,z);
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

export function _vec4(x?: number, y?: number, z?: number, w?: number) {
    return new vec4(x, y, z, w);
}

export type RGBA = [number, number, number, number];
export function dot(x:any, y:any): any {
    if (x instanceof vec3 && y instanceof vec3) {

    } else if (x instanceof vec4 && y instanceof vec4) {

    }
}

export function cross(x:vec3, y:vec3):vec3 {
    let cp:vec3 = new vec3();

    cp.x = x.y*y.z - x.z*y.y;
    cp.y = x.x*y.z - x.z*y.x;
    cp.z = x.x*y.y - x.y*y.x;

    return cp;
}

export function normalize(x: any):any {
    if (typeof(x) == "number") {
        return 1;
    }

    if (x instanceof vec3) {
        let v: vec3 = new vec3();
        v.x = x.x / length(x);
        v.y = x.y / length(x);
        v.z = x.z / length(x);

        return v;
    } else if (x instanceof vec4) {
        let v: vec4 = new vec4();
        v.x = x.x / length(x);
        v.y = x.y / length(x);
        v.z = x.z / length(x);
        v.w = x.w / length(x);

        return v;
    }

    let v: vec2 = new vec2();
    v.x = x.x / length(x);
    v.y = x.y / length(x);

    return v;
}

export function reflect(x: any): any {
    if (x instanceof vec3) {

    } else if (x instanceof vec4) {

    }
}

export function refract(x: any): any {
    if (x instanceof vec3) {

    } else if (x instanceof vec4) {

    }
}
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

export function step(edge:any, x: any):any {
    if (edge instanceof vec3 && x instanceof vec3) {

    } else if (edge instanceof vec4 && x instanceof vec4) {

    }
}

export function smoothstep(edge0: any, edge1: any, x: any):any {
    if (edge0 instanceof vec3 && edge1 instanceof vec3) {

    } else if (edge0 instanceof vec4 && edge1 instanceof vec4) {

    }
}

export function mix(x: any, y: any, a: any):any {
    if (x instanceof vec3 && y instanceof vec3) {
        let v:vec3 = new vec3();
    } else if (x instanceof vec4 && y instanceof vec4) {
        let v:vec4 = new vec4();
    }

    let v:vec2 = new vec2();
}

export function radians(degrees: any): any {
    if (degrees instanceof vec3) {

    } else if (degrees instanceof vec4) {

    }
}

export function degrees(radians:any):any {
    if (radians instanceof vec3) {

    } else if (radians instanceof vec4) {

    }
}

export function sin(x:any): any {
    if (x instanceof vec3) {
        let v:vec3 = new vec3();
        v.x = Math.sin(x.x);
        v.y = Math.sin(x.y);
        v.z = Math.sin(x.z);
        return v;
    } else if (x instanceof vec4) {
        let v:vec4 = new vec4();
        v.x = Math.sin(x.x);
        v.y = Math.sin(x.y);
        v.z = Math.sin(x.z);
        v.w = Math.sin(x.w);
        return v;
    }

    let v:vec2 = new vec2();
    v.x = Math.sin(x.x);
    v.y = Math.sin(x.y);
    return v;
}

export function cos(x:any): any {
    if (x instanceof vec3) {
        let v: vec3 = new vec3();
        v.x = Math.cos(x.x);
        v.y = Math.cos(x.y);
        v.z = Math.cos(x.z);
        return v;
    } else if (x instanceof vec4) {
        let v: vec4 = new vec4();
        v.x = Math.cos(x.x);
        v.y = Math.cos(x.y);
        v.z = Math.cos(x.z);
        v.w = Math.cos(x.w);
        return v;
    }

    let v: vec2 = new vec2();
    v.x = Math.cos(x.x);
    v.y = Math.cos(x.y);
    return v;
}

export function tan(x: any): any {
    if (x instanceof vec3) {
        let v: vec3 = new vec3();
        v.x = Math.tan(x.x);
        v.y = Math.tan(x.y);
        v.z = Math.tan(x.z);
        return v;
    } else if (x instanceof vec4) {
        let v: vec4 = new vec4();
        v.x = Math.tan(x.x);
        v.y = Math.tan(x.y);
        v.z = Math.tan(x.z);
        v.w = Math.tan(x.w);
        return v;
    }

    let v: vec2 = new vec2();
    v.x = Math.tan(x.x);
    v.y = Math.tan(x.y);
    return v;
}

export function asin(x: any): any {
    if (x instanceof vec3) {
        let v: vec3 = new vec3();
        v.x = Math.asin(x.x);
        v.y = Math.asin(x.y);
        v.z = Math.asin(x.z);
        return v;
    } else if (x instanceof vec4) {
        let v: vec4 = new vec4();
        v.x = Math.asin(x.x);
        v.y = Math.asin(x.y);
        v.z = Math.asin(x.z);
        v.w = Math.asin(x.w);
        return v;
    }

    let v: vec2 = new vec2();
    v.x = Math.asin(x.x);
    v.y = Math.asin(x.y);
    return v;
}

export function acos(x: any): any {
  if (x instanceof vec3) {
    let v: vec3 = new vec3();
    v.x = Math.acos(x.x);
    v.y = Math.acos(x.y);
    v.z = Math.acos(x.z);
    return v;
  } else if (x instanceof vec4) {
    let v: vec4 = new vec4();
    v.x = Math.acos(x.x);
    v.y = Math.acos(x.y);
    v.z = Math.acos(x.z);
    v.w = Math.acos(x.w);
    return v;
  }

  let v: vec2 = new vec2();
  v.x = Math.acos(x.x);
  v.y = Math.acos(x.y);
  return v;
}

export function atan(x: any, y:any): any {
  if (x instanceof vec3) {
    let v: vec3 = new vec3();
    v.x = Math.atan(x.x);
    v.y = Math.atan(x.y);
    v.z = Math.atan(x.z);
    return v;
  } else if (x instanceof vec4) {
    let v: vec4 = new vec4();
    v.x = Math.atan(x.x);
    v.y = Math.atan(x.y);
    v.z = Math.atan(x.z);
    v.w = Math.atan(x.w);
    return v;
  }

  let v: vec2 = new vec2();
  v.x = Math.atan(x.x);
  v.y = Math.atan(x.y);
  return v;
}

export function exp(x: any): any {
    if (x instanceof vec3) {

    } else if (x instanceof vec4) {

    }
}

export function log(x: any): any {
    if (x instanceof vec3) {

    } else if (x instanceof vec4) {

    }
}

export function exp2(x: any): any {
    if (x instanceof vec3) {

    } else if (x instanceof vec4) {

    }
}

export function log2(x: any): any {
    if (x instanceof vec3) {

    } else if (x instanceof vec4) {

    }
}

export function inversesqrt(x: any): any {
    if (x instanceof vec3) {

    } else if (x instanceof vec4) {

    }
}

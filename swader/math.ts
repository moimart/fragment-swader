import { pipeline } from "stream";

export class vec2 {
    public x: number = 0;
    public y: number = 0;

    public get u():number {
        return this.x;
    }

    public get v():number { 
        return this.y;
    }

    public get r():number {
        return this.x;
    }

    public get g(): number {
        return this.y;
    }

    public set r(r:number) {
        this.x = r;
    }

    public set g(g:number) {
        this.y = g;
    }

    public get vu():vec2 {
        return new vec2(this.y,this.x);
    }

    public get flipY():vec2 {
        return new vec2(this.x,1 - this.y);
    }

    public get flipX(): vec2 {
        return new vec2(1 - this.x, this.y);
    }

    constructor(x?: number, y?: number) {
        if (x != null) {
            this.x = x;
        }

        if (y != null) {
            this.y = y;
        }
    }

    add(p0: number | vec2): vec2 {
        if (typeof (p0) == "number") {
            return new vec2(this.x + p0, this.y + p0);
        }

        return new vec2(this.x + p0.x, this.y + p0.y);
    }

    sub(p0: number | vec2): vec2 {
        if (typeof (p0) == "number") {
            let v:vec2 = new vec2(this.x - p0, this.y - p0);
            v.x = (v.x < 0) ? 0 : v.x;
            v.y = (v.y < 0) ? 0 : v.y;
            return v; 
        }

        return new vec2(this.x - p0.x, this.y - p0.y);
    }

    mul(p0:number | vec2): vec2 {
        if (p0 instanceof vec2) {
            return new vec2(this.x * p0.x, this.y * p0.y);
        }

        return new vec2(this.x * p0,this.y * p0);
    }

    div(p0: number | vec2): vec2 {
        if (p0 instanceof vec2) {
            return new vec2(this.x / p0.x, this.y / p0.y);
        }

        return new vec2(this.x / p0, this.y / p0);
    }

    neg(): vec2 {
        return new vec3(-this.x, -this.y);
    }

    public get array():number[] {
        return [this.x,this.y];
    }

    swizzle(vars:string):vec2 {
        let v:vec2 = new vec2();

        if (vars.length > 2) {
            
        }

        return v;
    }
}

export function _vec2(x?: number, y?: number) {

    if (y == null) {
        return new vec2(x,x);
    }

    return new vec2(x,y);
}

export class vec3 extends vec2 {
    public z: number = 0;

    constructor(x?: number, y?: number, z?: number) {
        super(x, y);

        if (z != null) {
            this.z = z;
        }
    }

    public get b(): number {
        return this.z;
    }

    public set b(b: number) {
        this.z = b;
    }

    add(p0: number | vec3): vec3 {
        if (typeof (p0) == 'number') {
            return new vec3(this.x + p0, this.y + p0, this.z+ p0);
        }

        return new vec3(this.x + p0.x, this.y + p0.y, this.z + p0.z);
    }

    sub(p0: number | vec3): vec3 {
        if (typeof (p0) == 'number') {
            return new vec3(this.x - p0, this.y - p0, this.z - p0);
        }

        return new vec3(this.x - p0.x, this.y - p0.y, this.z - p0.z);
    }

    mul(p0: number | vec3): vec3 {
        if (p0 instanceof vec3) {
            return new vec3(this.x * p0.x, this.y * p0.y, this.z * p0.z);
        }

        return new vec3(this.x * p0, this.y * p0, this.z * p0);
    }

    div(p0: number | vec3): vec3 {
        if (p0 instanceof vec3) {
            return new vec3(this.x / p0.x, this.y / p0.y, this.z / p0.z);
        }

        return new vec3(this.x / p0, this.y / p0, this.z / p0);
    }

    neg(): vec3 {
        return new vec3(-this.x,-this.y,-this.z);
    }


    public get array(): number[] {
        return [this.x, this.y,this.z];
    }
}

export function _vec3(x?: number | vec2, y?: number, z?: number) {
    if (x instanceof vec2) {
        return new vec3(x.x,x.y,0);
    }

    return new vec3(x,y,z);
}

export class vec4 extends vec3 {
    public w: number = 0;

    constructor(x?: number, y?: number, z?: number, w?: number) {
        super(x, y, z);

        if (w != null) {
            this.w = w;
        }
    }

    get rgb(): vec3 {
        return new vec3(this.x, this.y, this.z);
    }

    public get a(): number {
        return this.w;
    }

    public set a(a: number) {
        this.w = a;
    }

    add(p0: vec4): vec4 {
        return new vec4(this.x + p0.x, this.y + p0.y, this.z + p0.z, this.w + p0.w);
    }

    sub(p0: vec4): vec4 {
        return new vec4(this.x - p0.x, this.y - p0.y, this.z - p0.z, this.w - p0.w);
    }

    mul(p0: number | vec4): vec4 {
        if (p0 instanceof vec4) {
          return new vec4(this.x * p0.x, this.y * p0.y, this.z * p0.z, this.w * p0.w);
        }

        return new vec4(this.x * p0, this.y * p0, this.z * p0, this.w * p0);
    }

    div(p0: number | vec4): vec4 {
        if (p0 instanceof vec4) {
            return new vec4(this.x / p0.x, this.y / p0.y, this.z / p0.z, this.w / p0.w);
        }

        return new vec4(this.x / p0, this.y / p0, this.z / p0, this.w / p0);
    }
    
    neg(): vec4 {
        return new vec4(-this.x, -this.y, -this.z, -this.w);
    }


    public get array(): number[] {
        return [this.x, this.y, this.z, this.w];
    }
}

export function _vec4(x?: number | vec3, y?: number, z?: number, w?: number) {
    if (x instanceof vec3) {
        return new vec4(x.x,x.y,x.z,1);
    }

    return new vec4(x, y, z, w);
}

export type RGBA = vec4;

const _dot = (xs: number[], ys: number[]) => {

    const zipWith = (f, xs, ys) => {
        const ny = ys.length;
        return (xs.length <= ny ? xs : xs.slice(0, ny))
            .map((x, i) => f(x, ys[i]));
    }

    const sum = xs => xs ? xs.reduce((a, b) => a + b, 0) : undefined;

    return xs.length === ys.length ? (
        sum(zipWith((a, b) => a * b, xs, ys))
    ) : undefined;
}

export function dot(x:any, y:any): any | undefined {
    if (x instanceof vec2 && y instanceof vec2) {
        return _dot(x.array,y.array);
    }

    return undefined;
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

    if (x instanceof vec4) {
        let v: vec4 = new vec4();
        v.x = x.x / length(x);
        v.y = x.y / length(x);
        v.z = x.z / length(x);
        v.w = x.w / length(x);

        return v;
    } else if (x instanceof vec3) {
        let v: vec3 = new vec3();
        v.x = x.x / length(x);
        v.y = x.y / length(x);
        v.z = x.z / length(x);

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
    if (orig instanceof vec4) {
        return Math.sqrt(orig.x * orig.x + orig.y * orig.y + orig.z * orig.z + orig.w * orig.w);
    } else if (orig instanceof vec3) {
        return Math.sqrt(orig.x * orig.x + orig.y * orig.y + orig.z * orig.z);
    }

    return Math.sqrt(orig.x * orig.x + orig.y * orig.y);
}
export function clamp(p0: any, min: any, max: any): any {

    if (p0 instanceof vec4) {
        let clamped = new vec4(p0.x, p0.y, p0.z, p0.w);
        if (p0.x < min.x) clamped.x = min.x;
        if (p0.x > max.x) clamped.x = max.x;
        if (p0.y < min.y) clamped.y = min.y;
        if (p0.y > max.y) clamped.y = max.y;
        if (p0.z < min.z) clamped.z = min.z;
        if (p0.z > max.z) clamped.z = max.z;
        if (p0.z < min.w) clamped.w = min.w;
        if (p0.z > max.w) clamped.w = max.w;

        return clamped;
    } else if (p0 instanceof vec3) {
        let clamped = new vec3(p0.x,p0.y,p0.z);
        if (p0.x < min.x) clamped.x = min.x;
        if (p0.x > max.x) clamped.x = max.x;
        if (p0.y < min.y) clamped.y = min.y;
        if (p0.y > max.y) clamped.y = max.y;
        if (p0.z < min.z) clamped.z = min.z;
        if (p0.z > max.z) clamped.z = max.z;

        return clamped;
    } else if (p0 instanceof vec2) {
        let clamped = new vec2(p0.x, p0.y);

        if (p0.x < min.x) clamped.x = min.x;
        if (p0.x > max.x) clamped.x = max.x;
        if (p0.y < min.y) clamped.y = min.y;
        if (p0.y > max.y) clamped.y = max.y;

        return clamped;
    }

    let clamped: number = p0 as number;
    if (p0 < min) clamped = min;
    if (p0 > max) clamped = max;
    return clamped;
}
export function pow(x:any,y:any):any {
    if (x instanceof vec4 && y instanceof vec4) {
        let v: vec4 = new vec4();
        v = clamp(v,0,1);
        v.x = Math.pow(x.x,y.x);
        v.y = Math.pow(x.y,y.y);
        v.z = Math.pow(x.z,y.z);
        v.w = Math.pow(x.w,y.w);
        return v;
    } else if (x instanceof vec3 && y instanceof vec3) {
        let v: vec3 = new vec3();
        v = clamp(v, 0, 1);
        v.x = Math.pow(x.x, y.x);
        v.y = Math.pow(x.y, y.y);
        v.z = Math.pow(x.z, y.z);
        return v;
    } else if (x instanceof vec2 && y instanceof vec2) {
        let v: vec2 = new vec2();
        v = clamp(v, 0, 1);
        v.x = Math.pow(x.x, y.x);
        v.y = Math.pow(x.y, y.y);
        return v;
    }

    if (typeof (x) == "number" && typeof (y) == "number") {
        let xx = clamp(x as number, 0, 1);
        let yy = clamp(y as number, 0, 1);
        return (Math.pow(xx,yy));
    }
    return 1;
}

export function step(edge:any, x: any):any {
    if (edge instanceof vec4 && x instanceof vec4) {
        let v: vec4 = new vec4();
        v.x = (x.x < edge.x) ? 0 : 1;
        v.y = (x.y < edge.y) ? 0 : 1;
        v.z = (x.z < edge.z) ? 0 : 1;
        v.w = (x.w < edge.w) ? 0 : 1;
        return v;
    }
    else if (edge instanceof vec3 && x instanceof vec3) {
        let v: vec3 = new vec3();
        v.x = (x.x < edge.x) ? 0 : 1;
        v.y = (x.y < edge.y) ? 0 : 1;
        v.z = (x.z < edge.z) ? 0 : 1;
        return v;
    }  else if (edge instanceof vec3 && typeof (x) == "number") {
        let v: vec3 = new vec3();
        v.x = (x < edge.x) ? 0 : 1;
        v.y = (x < edge.y) ? 0 : 1;
        v.z = (x < edge.z) ? 0 : 1;
        return v;
    } else if (typeof (edge) == "number" && typeof (x) == "number") {
        return (x < edge) ? 0 : 1;
    }

    let v: vec2 = new vec2();
    v.x = (x.x < edge.x) ? 0 : 1;
    v.y = (x.y < edge.y) ? 0 : 1;
    return v;
}

export function smoothstep(edge0: any, edge1: any, x: any):any {
    if (x instanceof vec4) {
        if (typeof (edge0) == "number" && typeof (edge1) == "number") {
            let t: vec4 = new vec4();
            t.x = clamp((x.x - edge0) / (edge1 - edge0), 0, 1);
            t.y = clamp((x.y - edge0) / (edge1 - edge0), 0, 1);
            t.z = clamp((x.z - edge0) / (edge1 - edge0), 0, 1);
            t.w = clamp((x.w - edge0) / (edge1 - edge0), 0, 1);
            t.x = t.x * t.x * (3 - 2 * t.x);
            t.y = t.y * t.y * (3 - 2 * t.y);
            t.z = t.z * t.z * (3 - 2 * t.z);
            t.w = t.w * t.w * (3 - 2 * t.w);
            return t;
        } else {
          let t: vec4 = new vec4();
          t.x = clamp((x.x - edge0.x) / (edge1.x - edge0.x), 0, 1);
          t.y = clamp((x.y - edge0.y) / (edge1.y - edge0.y), 0, 1);
          t.z = clamp((x.z - edge0.z) / (edge1.z - edge0.z), 0, 1);
          t.w = clamp((x.w - edge0.w) / (edge1.w - edge0.w), 0, 1);
          t.x = t.x * t.x * (3 - 2 * t.x);
          t.y = t.y * t.y * (3 - 2 * t.y);
          t.z = t.z * t.z * (3 - 2 * t.z);
          t.w = t.w * t.w * (3 - 2 * t.w);
          return t;
        }
    } else if (x instanceof vec3) {
        if (typeof (edge0) == "number" && typeof (edge1) == "number") {
            let t: vec3 = new vec3();
            t.x = clamp((x.x - edge0) / (edge1 - edge0), 0, 1);
            t.y = clamp((x.y - edge0) / (edge1 - edge0), 0, 1);
            t.z = clamp((x.z - edge0) / (edge1 - edge0), 0, 1);
            t.x = t.x * t.x * (3 - 2 * t.x);
            t.y = t.y * t.y * (3 - 2 * t.y);
            t.z = t.z * t.z * (3 - 2 * t.z);
            
            return t;
        } else {
            let t: vec3 = new vec3();
            t.x = clamp((x.x - edge0.x) / (edge1.x - edge0.x), 0, 1);
            t.y = clamp((x.y - edge0.y) / (edge1.y - edge0.y), 0, 1);
            t.z = clamp((x.z - edge0.z) / (edge1.z - edge0.z), 0, 1);
            t.x = t.x * t.x * (3 - 2 * t.x);
            t.y = t.y * t.y * (3 - 2 * t.y);
            t.z = t.z * t.z * (3 - 2 * t.z);
            return t;
        }
    } else if (x instanceof vec2) {
        if (typeof(edge0) == "number" && typeof(edge1) == "number") {
            let t: vec2 = new vec2();
            t.x = clamp((x.x - edge0) / (edge1 - edge0), 0, 1);
            t.y = clamp((x.y - edge0) / (edge1 - edge0), 0, 1);
            t.x = t.x * t.x * (3 - 2 * t.x);
            t.y = t.y * t.y * (3 - 2 * t.y);
            return t;
        } else {
            let t: vec2 = new vec2();
            t.x = clamp((x.x - edge0.x) / (edge1.x - edge0.x), 0, 1);
            t.y = clamp((x.y - edge0.y) / (edge1.y - edge0.y), 0, 1);
            t.x = t.x * t.x * (3 - 2 * t.x);
            t.y = t.y * t.y * (3 - 2 * t.y);
            return t;
        }
    }

    let t:number =  clamp((x - edge0) / (edge1 - edge0),0,1);
    return t * t * (3 - 2 * t);
}

export function mix(x: any, y: any, a: any):any {
    if (x instanceof vec3 && y instanceof vec3) {
        let b = clamp(a,0.0,1.0);
        let v:vec3 = new vec3();
        v.x = x.x + b * (y.x - x.x);
        v.y = x.y + b * (y.y - x.y);
        v.z = x.z + b * (y.z - x.z);
        return v;
    } else if (x instanceof vec4 && y instanceof vec4) {
        let b = clamp(a,0.0,1.0);
        let v:vec4 = new vec4();
        v.x = x.x + b * (y.x - x.x);
        v.y = x.y + b * (y.y - x.y);
        v.z = x.z + b * (y.z - x.z);
        v.w = x.w + b * (y.w - x.w);
        return v;
    }

    let v:vec2 = new vec2();
    return v;
}

export function radians(degrees: any): any {
    if (radians instanceof vec4) {
        let v: vec4 = new vec4();
        v.x = degrees.x * Math.PI / 180;
        v.y = degrees.y * Math.PI / 180;
        v.z = degrees.z * Math.PI / 180;
        v.w = degrees.w * Math.PI / 180;
        return v;
    } else if (radians instanceof vec3) {
        let v: vec3 = new vec3();
        v.x = degrees.x * Math.PI / 180;
        v.y = degrees.y * Math.PI / 180;
        v.z = degrees.z * Math.PI / 180;
        return v;
    } else if (radians instanceof vec2) {
        let v: vec2 = new vec2();
        v.x = degrees.x * Math.PI / 180;
        v.y = degrees.y * Math.PI / 180;
        return v;
    }

    return (degrees as number) * Math.PI / 180;
}

export function degrees(radians:any):any {
    if(radians instanceof vec4) {
        let v: vec4 = new vec4();
        v.x = radians.x * 180 / Math.PI;
        v.y = radians.y * 180 / Math.PI;
        v.z = radians.z * 180 / Math.PI;
        v.w = radians.w * 180 / Math.PI;
        return v;
    } else if (radians instanceof vec3) {
        let v: vec3 = new vec3();
        v.x = radians.x*180 / Math.PI;
        v.y = radians.y*180 / Math.PI;
        v.z = radians.z*180 / Math.PI;
        return v;
    } else if (radians instanceof vec2) {
        let v: vec2 = new vec2();
        v.x = radians.x * 180 / Math.PI;
        v.y = radians.y * 180 / Math.PI;
        return v;
    }

    return (radians as number) * 180 / Math.PI;
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
    if (x instanceof vec4) {
        let v: vec4 = new vec4();
        v.x = Math.exp(x.x);
        v.y = Math.exp(x.y);
        v.z = Math.exp(x.z);
        v.w = Math.exp(x.w);
        return v;
    } else if (x instanceof vec3) {
        let v: vec3 = new vec3();
        v.x = Math.exp(x.x);
        v.y = Math.exp(x.y);
        v.z = Math.exp(x.z);
        return v;
    } else if (x instanceof vec2) {
        let v: vec2 = new vec2();
        v.x = Math.exp(x.x);
        v.y = Math.exp(x.y);
        return v;
    }

    return Math.exp(x as number);
}

export function log(x: any): any {
    if(x instanceof vec4) {
        let v: vec4 = new vec4();
        v.x = Math.log(x.x);
        v.y = Math.log(x.y);
        v.z = Math.log(x.z);
        v.w = Math.log(x.w);
        return v;
    } else if (x instanceof vec3) {
        let v: vec3 = new vec3();
        v.x = Math.log(x.x);
        v.y = Math.log(x.y);
        v.z = Math.log(x.z);
        return v;
    } else if (x instanceof vec2) {
        let v: vec4 = new vec4();
        v.x = Math.log(x.x);
        v.y = Math.log(x.y);
        return v;
    }

    return Math.log(x as number);
}

export function exp2(x: any): any {
    if (x instanceof vec4) {
        let v: vec4 = new vec4();
        v.x = Math.exp(x.x);
        v.y = Math.exp(x.y);
        v.z = Math.exp(x.z);
        v.w = Math.exp(x.w);
        return v;
    } else if (x instanceof vec3) {
        let v: vec3 = new vec3();
        v.x = Math.exp(x.x);
        v.y = Math.exp(x.y);
        v.z = Math.exp(x.z);
        return v;
    } else if (x instanceof vec2) {
        let v: vec2 = new vec2();
        v.x = Math.exp(x.x);
        v.y = Math.exp(x.y);
        return v;
    }

    return Math.exp(x as number);
}

export function log2(x: any): any {
    if (x instanceof vec4) {
        let v: vec4 = new vec4();
        v.x = Math.log2(x.x);
        v.y = Math.log2(x.y);
        v.z = Math.log2(x.z);
        v.w = Math.log2(x.w);
        return v;
    } else if (x instanceof vec3) {
        let v: vec3 = new vec3();
        v.x = Math.log2(x.x);
        v.y = Math.log2(x.y);
        v.z = Math.log2(x.z);
        return v;
    } else if (x instanceof vec2) {
        let v: vec2 = new vec2();
        v.x = Math.log2(x.x);
        v.y = Math.log2(x.y);
        return v;
    }

    return Math.log2(x as number);
}

export function inversesqrt(x: any): any {

    const buf = new ArrayBuffer(4),
        f32 = new Float32Array(buf),
        u32 = new Uint32Array(buf);

    function _rsqrt(x) {
        const x2 = 0.5 * (f32[0] = x);
        u32[0] = (0x5f3759df - (u32[0] >> 1)); // what the fuck? 
        let y = f32[0];
        y = y * (1.5 - (x2 * y * y));   // 1st iteration
        return y;
    }

    if (x instanceof vec4) {
        let v: vec4 = new vec4();
        v.x = _rsqrt(x.x);
        v.y = _rsqrt(x.y);
        v.z = _rsqrt(x.z);
        v.w = _rsqrt(x.w);
        return v;
    } else if (x instanceof vec3) {
        let v: vec3 = new vec3();
        v.x = _rsqrt(x.x);
        v.y = _rsqrt(x.y);
        v.z = _rsqrt(x.z);
        return v;
    } else if (x instanceof vec2) {
        let v: vec2 = new vec2();
        v.x = _rsqrt(x.x);
        v.y = _rsqrt(x.y);
        return v;
    }

    return Math.sqrt(x as number);
}

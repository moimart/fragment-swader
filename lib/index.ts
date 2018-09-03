import * as sharp from 'sharp';
import * as fs from 'fs';

export class vec2 {
    public x:number = 0;
    public y:number = 0;

    constructor(x?: number, y?:number) {
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

    sub(p0: vec2):vec2 {
        return new vec2(this.x - p0.x,this.y - p0.y);
    }
}

export class vec3 extends vec2 {
    public z:number = 0;

    constructor(x?: number, y?: number, z?: number) {
        super(x,y);

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
    public w:number = 0;

    constructor(x?: number, y?: number, z?: number, w?:number) {
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

export type RGBA = [number,number,number,number];
export type textureInfo = [Uint32Array,vec2];
export type Shader = (coords:vec2,samplers:Array<textureInfo>) => RGBA;

export function distance(p0:vec2,p1:vec2):number {
    return length(p0.sub(p1));
}

export function length(orig:vec2) {
    return Math.sqrt(orig.x*orig.x + orig.y*orig.y);
}

export function clamp(p0:vec2 | vec3 | vec4, p1:vec2 | vec3 | vec4): any {
    if (p0 instanceof vec2) {

    }
}

export function textureFetch(texture: textureInfo, coords: vec2, mode:string = "clamp", filtering:string = "bilinear"):RGBA {
    let size = texture[1];
    let data = texture[0];

    let rCoords:vec2 = new vec2(Math.floor(coords.x * size.x), Math.floor(coords.y * size.y));
    
    if (mode == "clamp") {
        rCoords.x = (rCoords.x > size.x) ? size.x : rCoords.x;
        rCoords.y = (rCoords.y > size.y) ? size.y : rCoords.y;
    } else if (mode == "repeat") {
      rCoords.x = (rCoords.x > size.x) ? (rCoords.x % size.x) : rCoords.x;
      rCoords.y = (rCoords.y > size.y) ? (rCoords.y % size.y) : rCoords.y;
    }

    let rawColor = data[rCoords.y*size.x + rCoords.x];

    let rawRGBA: RGBA = [rawColor & 0xff,(rawColor >> 8) & 0xff, (rawColor >> 16) & 0xff, (rawColor >> 24) & 0xff];

    return [rawRGBA[0]/255,rawRGBA[1]/255,rawRGBA[2]/255,rawRGBA[3]/255];
}

export class ShaderProcess {
    public size:vec2 = new vec2(1024,576);
    private _framebuffer?: Buffer;
    private samplers: Array<textureInfo> = new Array<textureInfo>();

    public get framebuffer(): Buffer {
        return this._framebuffer;
    }
    private shader?: Shader;
    constructor(shader: Shader) {
        this._framebuffer = Buffer.alloc(4*this.size.x*this.size.y);
        this.shader = shader;
    }

    async addTexture(texture:string) {
        let image = sharp(texture);
        let data = await image.raw().toBuffer();
        let arr = new Uint32Array(data.length/4);
        
        let read = 0;
        let i = 0;
        while (read < data.length) {
            arr[i++] = data.readUInt32LE(read);
            read += 4;
        }

        let metadata = await image.metadata();
        this.samplers.push([arr,new vec2(metadata.width,metadata.height)]);
    }

    run(): void {
        let buffer = new Uint32Array(this._framebuffer);
        for (let i = 0; i < this.size.y; i++) {
            for (let j = 0; j < this.size.x; j++) {
                let fragment: RGBA = this.execute(new vec2(j/this.size.x,i/this.size.y));
                const order = i*this.size.x + j;
                buffer[order] = fragment[3] << 24 | fragment[2] << 16 | fragment[1] << 8 | fragment[0];
            }
        }
        this._framebuffer = Buffer.from(buffer.buffer);
    }

    extract(): sharp.SharpInstance {
        return sharp(this.framebuffer,{ raw: {
            width: this.size.x,
            height: this.size.y,
            channels: 4
        }});
    }

    execute(coords: vec2):RGBA {
        let fragColor:RGBA = [255,0,0,255];
        fragColor = this.shader(coords, this.samplers);
        return this.toByte(fragColor);
    }

    private toByte(color:RGBA): RGBA {
        return [color[0] * 255, color[1] * 255, color[2] * 255, color[3] * 255];
    }
}


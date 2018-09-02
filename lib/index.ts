import * as sharp from 'sharp';
import * as fs from 'fs';

export type RGBA = [number,number,number,number];
export type vec4 = RGBA;
export type vec3 = [number,number,number];
export type vec2 = [number,number]
export type textureInfo = [Uint32Array,vec2];
export type Shader = (coords:vec2,samplers:Array<textureInfo>) => RGBA;

export function distance(p0:vec2,p1:vec2):number {
    return length([p0[0] -  p1[0],p0[1] - p1[1]]);
}

export function length(orig:vec2) {
    return Math.sqrt(orig[0]*orig[0] + orig[1]*orig[1]);
}

export function textureFetch(texture: textureInfo, coords: vec2, filtering:string = "linear"):RGBA {
    let size = texture[1];
    let data = texture[0];

    let rCoords:vec2 = [Math.floor(coords[0] * size[0]), Math.floor(coords[1] * size[1])];
    // take additional numbers for filtering

    let rawColor = data[rCoords[1]*size[0] + rCoords[0]];

    let rawRGBA: RGBA = [rawColor & 0xff,(rawColor >> 8) & 0xff, (rawColor >> 16) & 0xff, 255];//rawColor & 0x000000ff];

    return [rawRGBA[0]/255,rawRGBA[1]/255,rawRGBA[2]/255,rawRGBA[3]/255];
}

export class ShaderProcess {
    public size:[number,number] = [1024,576];
    private _framebuffer?: Buffer;
    private samplers: Array<textureInfo> = new Array<textureInfo>();

    public get framebuffer(): Buffer {
        return this._framebuffer;
    }
    private shader?: Shader;
    constructor(shader: Shader) {
        this._framebuffer = Buffer.alloc(4*this.size[0]*this.size[1]);
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
        this.samplers.push([arr,[metadata.width,metadata.height]]);
    }

    run(): void {
        let buffer = new Uint32Array(this._framebuffer);
        for (let i = 0; i < this.size[1]; i++) {
            for (let j = 0; j < this.size[0]; j++) {
                let fragment: RGBA = this.execute([j/this.size[0],i/this.size[1]]);
                const order = i*this.size[0] + j;
                buffer[order] = fragment[3] << 24 | fragment[2] << 16 | fragment[1] << 8 | fragment[0];
            }
        }
        this._framebuffer = Buffer.from(buffer.buffer);
    }

    extract(): sharp.SharpInstance {
        return sharp(this.framebuffer,{ raw: {
            width: this.size[0],
            height: this.size[1],
            channels: 4
        }});
    }

    execute(coords: [number,number]):RGBA {
        let fragColor:RGBA = [255,0,0,255];
        fragColor = this.shader(coords, this.samplers);
        return this.toByte(fragColor);
    }

    private toByte(color:RGBA): RGBA {
        return [color[0] * 255, color[1] * 255, color[2] * 255, color[3] * 255];
    }
}


import * as fs from 'fs';
import * as sharp from 'sharp';
import { clamp, distance, length, RGBA, vec2, vec3, vec4 } from './math';
import { textureInfo } from './texture';

export type Shader = (coords: vec2, samplers: Array<textureInfo>) => RGBA;
export class ShaderProcess {
    public size: vec2 = new vec2(1024, 576);
    private _framebuffer?: Buffer;
    private samplers: Array<textureInfo> = new Array<textureInfo>();

    public get framebuffer(): Buffer {
        return this._framebuffer;
    }
    private shader?: Shader;
    constructor(shader: Shader) {
        this._framebuffer = Buffer.alloc(4 * this.size.x * this.size.y);
        this.shader = shader;
    }

    async addTexture(texture: string) {
        let image = sharp(texture);
        let data = await image.raw().toBuffer();
        let arr = new Uint32Array(data.length / 4);

        let read = 0;
        let i = 0;
        while (read < data.length) {
            arr[i++] = data.readUInt32LE(read);
            read += 4;
        }

        let metadata = await image.metadata();
        this.samplers.push([arr, new vec2(metadata.width, metadata.height)]);
    }

    run(): void {
        let buffer = new Uint32Array(this._framebuffer);
        for (let i = 0; i < this.size.y; i++) {
            for (let j = 0; j < this.size.x; j++) {
                let fragment: RGBA = this.execute(new vec2(j / this.size.x, i / this.size.y));
                const order = i * this.size.x + j;
                buffer[order] = fragment[3] << 24 | fragment[2] << 16 | fragment[1] << 8 | fragment[0];
            }
        }
        this._framebuffer = Buffer.from(buffer.buffer);
    }

    extract(): sharp.SharpInstance {
        return sharp(this.framebuffer, {
            raw: {
                width: this.size.x,
                height: this.size.y,
                channels: 4
            }
        });
    }

    execute(coords: vec2): RGBA {
        let fragColor: RGBA = [255, 0, 0, 255];
        fragColor = this.shader(coords, this.samplers);
        return this.toByte(fragColor);
    }

    private toByte(color: RGBA): RGBA {
        return [color[0] * 255, color[1] * 255, color[2] * 255, color[3] * 255];
    }
}
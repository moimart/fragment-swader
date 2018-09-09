import * as fs from 'fs';
import * as sharp from 'sharp';
import { clamp, distance, length, RGBA, vec2, vec3, vec4, _vec2 } from './math';
import { TextureInfo } from './texture';

export type Shader = (coords: vec2, samplers: Array<TextureInfo>) => RGBA;
export type ShaderProgress = (progress:number) => void;
export class ShaderProcess {
    public size: vec2 = new vec2(1024, 576);
    private _framebuffer?: Buffer;
    private progress:ShaderProgress = null;
    public samplers: Array<TextureInfo> = new Array<TextureInfo>();

    public get framebuffer(): Buffer {
        return this._framebuffer;
    }
    private shader?: Shader;
    constructor(shader: Shader) {
        this._framebuffer = Buffer.alloc(4 * this.size.x * this.size.y);
        this.shader = shader;
    }

    public set onProgress(callback:ShaderProgress) {
        this.progress = callback;
    }

    async addTexture(texture: string) {
        try {
            let image = sharp(texture);
            let metadata = await image.metadata();

            if (metadata.channels < 4) {
                throw 'Image does not have alpha channel';
            }

            let data = await image.raw().toBuffer();
            let arr = new Uint32Array(data.length / 4);

            let read = 0;
            let i = 0;
            while (read < data.length) {
                arr[i++] = data.readUInt32LE(read);
                read += 4;
            }

            this.samplers.push({buffer: arr, size: new vec2(metadata.width, metadata.height)});
        } catch(e) {
            throw 'Could not load texture: ' + e;
        }
    }

    addTextureFromFramebuffer(texture: Buffer, size:vec2) {
        let arr = new Uint32Array(texture.length / 4);
    
        let read = 0;
        let i = 0;
        while (read < texture.length) {
            arr[i++] = texture.readUInt32LE(read);
            read += 4;
        }

        this.samplers.push({buffer: arr, size: size});
    }

    run(): void {
        let buffer = new Uint32Array(this._framebuffer);
        for (let i = 0; i < this.size.y; i++) {
            for (let j = 0; j < this.size.x; j++) {
                let fragment: RGBA = this.execute(new vec2(j / this.size.x, i / this.size.y));
                const order = i * this.size.x + j;
                buffer[order] = fragment.w << 24 | fragment.z << 16 | fragment.y << 8 | fragment.x;

                if (this.progress != null) {
                    this.progress(order / (this.size.x * this.size.y));
                }
            }
        }
        this._framebuffer = Buffer.from(buffer.buffer);

        if (this.progress != null) {
            this.progress(1);
        }
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

    private execute(coords: vec2): RGBA {
        return this.shader(coords, this.samplers).mul(255);
    }
}

export interface ShaderPass {
    shader:Shader;
    textures:Array<string>;
    process?:ShaderProcess;
}

export class PostProcess {
    private passes:Array<ShaderPass> = new Array<ShaderPass>();
    public size:vec2 = _vec2(1024,576);
    private progress: ShaderProgress = null;
    private shaderProgress: number = 0;

    constructor(passes:Array<ShaderPass>) {
        this.passes = passes;
    }
    async run() {
        try {
            for (let j = 0; j < this.passes.length; j++) {
                let pass = this.passes[j];
                this.passes[j].process = new ShaderProcess(pass.shader);
                let s = this.passes[j].process;
                s.size = this.size;

                if (j > 0) {
                    await s.addTextureFromFramebuffer(
                        this.passes[j - 1].process.framebuffer,
                        this.passes[j - 1].process.size);
                }

                for (const texture of pass.textures) {
                    await s.addTexture(texture);
                }

                s.onProgress = (value: number) => {
                    if (this.progress != null) {
                        this.progress((value + this.shaderProgress)*.25);

                        if (value == 1) {
                            this.shaderProgress++;
                        }
                    }
                }
            
                s.run();
            }
        } catch (exception) { 
            throw 'Error at processing: ' + exception;
        }; 
    }

    public get framebuffer():Buffer {
        return this.passes[this.passes.length - 1].process.framebuffer;
    }

    public set onProgress(callback: ShaderProgress) {
        this.progress = callback;
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
}
fragment-swader
======

Do image manipulation with homegrown TypeScript shaders. 

It includes convenience types and GLSL-like functions to help 
writing or porting existing fragment shaders.

Vector types include operations for addition (add), substraction (sub), 
multiplication (mul), negation (neg) and other helpers to emulate at a small extent swizzling (for example: vec4 has a rgb property returning a vec3; vec2 has a vu returning the reversed coordinates)

# This is very much Work-in-progress! WIP

# Example

```
import {
    vec2,
    vec3,
    vec4,
    _vec2,
    _vec3,
    _vec4,
    Shader,
    textureInfo,
    ShaderProcess,
    distance,
    step,
    smoothstep,
    textureFetch
} from 'fragment-swader';

//Actual typescript shader code
let myShader: Shader = (coords: vec2, samplers: Array<textureInfo>) => {
    let uv: vec2 = coords.mul(2).neg().add (1);
    let n: vec3 = textureFetch(samplers[0], coords).rgb;
    let f = 1 - length(pow(uv,_vec2(6)));
    let d: vec3 = n.mul(f).add(n.mul(.2*(1 - f)));

    return _vec4(d);
}

async function _() {
    // Create shader
    let s = new ShaderProcess(myShader);
    await s.addTexture('texture.png').catch(err => console.error(err));
    s.run();
    s.extract().png().toFile('test.png', (err, info) => {
        err && console.log(err);
    });
}

//Excute all!
_();
```

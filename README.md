fragment-swader
======

Do image manipulation with homegrown TypeScript shaders. 

It includes convenience types and GLSL-like functions to help 
writing or porting existing fragment shaders.

This is very much Work-in-progress! WIP

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
    let d = (0.8 - distance(coords, _vec2(.5)));
    d = smoothstep(.2,.6,d);
    let c = textureFetch(samplers[0], _vec2(coords.x,coords.y));
    
    let color = c.mul(d);
    color.w = 1;
    return color;
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

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
} from './swader';

let myShader: Shader = (coords: vec2, samplers: Array<textureInfo>) => {
    let d = (0.8 - distance(coords, _vec2(.5)));
    d = smoothstep(.2,.6,d);
    let c = textureFetch(samplers[0], _vec2(coords.x,coords.y));
    
    let color = c.mul(d);
    color.w = 1;
    return color;
}

let fancyShader: Shader = (coords: vec2, samplers: Array<textureInfo>) => {
    let d = (0.8 - distance(coords, _vec2(.5)));
    let c = textureFetch(samplers[0], _vec2(coords.x, coords.y));

    let color = c.mul(d);
    color.w = 1;
    return color;
}

async function _() {
    let s = new ShaderProcess(myShader);
    await s.addTexture('texture.png').catch(err => console.error(err));
    s.run();
    s.extract().png().toFile('test.png', (err, info) => {
        err && console.log(err);
    });
}

_();

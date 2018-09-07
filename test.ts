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
    pow,
    length,
    textureFetch
} from './swader';

let myShader: Shader = (coords: vec2, samplers: Array<textureInfo>) => {
    let d = (0.8 - distance(coords, _vec2(.5)));
    d = smoothstep(.2,.6,d);
    let c = textureFetch(samplers[0], coords.mul(2.5),"repeat");
    
    let color = c.mul(d);
    color.a = 1;
    return color;
}

let fancyShader: Shader = (coords: vec2, samplers: Array<textureInfo>) => {
    let uv: vec2 = coords.mul(2).neg().add(1);
    let n: vec3 = textureFetch(samplers[0], coords).rgb;
    let f = 1 - length(pow(uv,_vec2(6)));
    let d: vec3 = n.mul(f).add(n.mul(.05*(1 - f)));

    return _vec4(d);
}

async function _() {
    let s = new ShaderProcess(myShader);
    //s.size = _vec2(828,1190);
    s.size = s.size.mul(2);
    await s.addTexture('texture.png').catch(err => console.error(err));
    s.run();
    s.extract().png().toFile('test.png', (err, info) => {
        err && console.log(err);
    });
}

_();

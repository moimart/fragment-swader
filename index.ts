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
    textureFetch
} from './swader';

let myShader: Shader = (coords: vec2, samplers: Array<textureInfo>) => {
    let d = (0.8 - distance(coords, _vec2(.5, .5)));
    let c = textureFetch(samplers[0], _vec2(coords.x,coords.y));

    return [d*c[0], d*c[1], d*c[2], 1];
}

async function doIt() {
    let s = new ShaderProcess(myShader);
    await s.addTexture('texture.png');
    s.run();
    s.extract().png().toFile('test.png', (err, info) => {
        console.log(err);
    });
}

doIt();

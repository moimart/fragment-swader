import * as swader from './lib';

let myShader: swader.Shader = (coords: swader.vec2, samplers: Array<swader.textureInfo>) => {
    let d = (0.8 - swader.distance(coords, [.5, .5]));

    let c = swader.textureFetch(samplers[0],coords);

    return [d*c[0], d*c[1], d*c[2], 1];
}

async function doIt() {
    let s = new swader.ShaderProcess(myShader);
    await s.addTexture('texture.png');
    s.run();
    s.extract().png().toFile('test.png', (err, info) => {
        console.log(err);
    });
}

doIt();

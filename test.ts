import * as $ from './swader';

let myShader: $.Shader = (coords: $.vec2, samplers: Array<$.TextureInfo>) => {
    let d = (0.8 - $.distance(coords, $._vec2(.5)));
    d = $.smoothstep(.2,.6,d);
    let c = $.textureFetch(samplers[0], coords.mul(2.5),"repeat");
    
    let color = c.mul(d);
    color.a = 1;
    return color;
}

let fancyShader: $.Shader = (coords: $.vec2, samplers: Array<$.TextureInfo>) => {
    let uv: $.vec2 = coords.mul(2).neg().add(1);
    let n: $.vec3 = $.textureFetch(samplers[0], coords).rgb;
    let f = 1 - $.length($.pow(uv,$._vec2(6)));
    let d: $.vec3 = n.mul(f).add(n.mul(.05*(1 - f)));

    return $._vec4(d);
}

let blurValue = 2.2;

let blurrPass1: $.Shader = (coords: $.vec2, samplers: Array<$.TextureInfo>) => {

    let blurSize = blurValue / samplers[0].size.x;

    let sum:$.vec4 = $._vec4(0,0,0,1);

    sum = sum.add($.textureFetch(samplers[0], $._vec2(coords.x - 4.0 * blurSize, coords.y)).mul(0.05));
    sum = sum.add($.textureFetch(samplers[0], $._vec2(coords.x - 3.0 * blurSize, coords.y)).mul(0.09));
    sum = sum.add($.textureFetch(samplers[0], $._vec2(coords.x - 2.0 * blurSize, coords.y)).mul(0.12));
    sum = sum.add($.textureFetch(samplers[0], $._vec2(coords.x - blurSize, coords.y)).mul(0.15));
    sum = sum.add($.textureFetch(samplers[0], $._vec2(coords.x, coords.y)).mul(0.16));
    sum = sum.add($.textureFetch(samplers[0], $._vec2(coords.x + blurSize, coords.y)).mul(0.15));
    sum = sum.add($.textureFetch(samplers[0], $._vec2(coords.x + 2.0 * blurSize, coords.y)).mul(0.12));
    sum = sum.add($.textureFetch(samplers[0], $._vec2(coords.x + 3.0 * blurSize, coords.y)).mul(0.09));
    sum = sum.add($.textureFetch(samplers[0], $._vec2(coords.x + 4.0 * blurSize, coords.y)).mul(0.05));

    return sum;
};

let blurrPass2: $.Shader = (coords: $.vec2, samplers: Array<$.TextureInfo>) => {

    let blurSize = blurValue / samplers[0].size.y;

    let sum: $.vec4 = $._vec4(0);

    sum = sum.add($.textureFetch(samplers[0], $._vec2(coords.x, coords.y - 4.0 * blurSize)).mul(0.05));
    sum = sum.add($.textureFetch(samplers[0], $._vec2(coords.x, coords.y - 3.0 * blurSize)).mul(0.09));
    sum = sum.add($.textureFetch(samplers[0], $._vec2(coords.x, coords.y - 2.0 * blurSize)).mul(0.12));
    sum = sum.add($.textureFetch(samplers[0], $._vec2(coords.x, coords.y - blurSize)).mul(0.15));
    sum = sum.add($.textureFetch(samplers[0], $._vec2(coords.x, coords.y)).mul(0.16));
    sum = sum.add($.textureFetch(samplers[0], $._vec2(coords.x, coords.y + blurSize)).mul(0.15));
    sum = sum.add($.textureFetch(samplers[0], $._vec2(coords.x, coords.y + 2.0 * blurSize)).mul(0.12));
    sum = sum.add($.textureFetch(samplers[0], $._vec2(coords.x, coords.y + 3.0 + blurSize)).mul(0.09));
    sum = sum.add($.textureFetch(samplers[0], $._vec2(coords.x, coords.y + 4.0 + blurSize)).mul(0.05));

    sum.a = 1;
    return sum;
};

async function _() {
    let s = new $.ShaderProcess(myShader);
    s.size = $._vec2(1024, 576).mul(2);
    s.onProgress = (progress: number) => {
        process.stdout.write(' Progress: ' + Math.floor(progress*100) + '%\r');

        if (progress == 1) {
            console.log(' Progress: 100% Done!');
        }
    };
    await s.addTexture('texture.png').catch(err => console.error(err));
    s.run();
    s.extract().png().toFile('test.png', (err, info) => {
        err && console.log(err);
    });
}

async function __() {
    let passes = new Array<$.ShaderPass>();

    passes.push({
        shader:blurrPass1,
        textures: new Array<string>("texture.png")
    });

    passes.push({
        shader:blurrPass2,
        textures:new Array<string>()
    });

    passes.push({shader: myShader, textures: new Array<string>()});

    let postProcess = new $.PostProcess(passes);
    postProcess.onProgress = (progress: number) => {
        process.stdout.write(' Postprocessing Progress: ' + Math.floor(progress * 100) + '%\r');

        if (progress == 1) {
            console.log(' Postprocessing Progress: 100% Done!');
        }
    };
    await postProcess.run();
    postProcess.extract().png().toFile('test-process.png', (err, info) => {
        err && console.log(err);
    });
}

_();

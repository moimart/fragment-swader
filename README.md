fragment-swader
======

Do image manipulation with homegrown TypeScript shaders. 

This was started as a toy but it can serve as foundation for a 
fully "JS-native" image manipulation/processing library

It includes convenience types and GLSL-like functions to help 
writing or porting existing fragment shaders.

Supports bilinear, nearest-neighbor for texture filtering; Textures 
can be "clamp"ed or "repeat"ed

Vector types include operations for addition (add), substraction (sub), 
multiplication (mul), negation (neg) and other helpers to emulate at a 
small extent swizzling (for example: vec4 has a rgb property returning a 
vec3; vec2 has a vu returning the reversed coordinates)

# This is very much Work-in-progress! WIP

# Example for a single hader

```
import * as $ from 'fragment-swader';

//Actual typescript shader code
let myShader: $.Shader = (coords: $.vec2, samplers: Array<$.TextureInfo>) => {
    let d = (0.8 - $.distance(coords, $._vec2(.5)));
    d = $.smoothstep(.2,.6,d);
    let c = $.textureFetch(samplers[0], coords.mul(2.5),"repeat");
    
    let color = c.mul(d);
    color.a = 1;
    return color;
}

//Export the resulting framebuffer to a .png file
async function _() {
    // Create shader
    let s = new ShaderProcess(myShader);
    s.size = $._vec2(1024, 576).mul(2); //Double the resolution!
    
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

//Execute it!
_();
```

# Source image 
![alt text](https://i.imgur.com/QauclJr.png "Original")

# Result 

![alt text](https://i.imgur.com/icIlBwZ.png "Result")

# Example for postprocessing (Blur)

```
import * as $ from 'fragment-swader';

//uniform value for both shaders
let blurValue = 2.2;

// Shader code for first pass
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

// Shader code for second pass
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

//Setup the postprocessing pipeline, run it and extract the 
//framebuffer to a .png file

async function _() {
    let passes = new Array<$.ShaderPass>();

    passes.push({
        shader:blurrPass1,
        textures: new Array<string>("texture.png")
    });

    passes.push({
        shader:blurrPass2,
        textures:new Array<string>()
    });

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

Execute it!
_();
```

# Source image 
![alt text](https://i.imgur.com/QauclJr.png "Original")

# Result 

![alt text](https://i.imgur.com/veG2CMR.png "Postprocess result")

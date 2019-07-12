import { Shader } from "../Shader";

// Shader= MetaBalls

export class MetaBalls extends Shader {

    public name = "MetaBalls";

    public params = [
        { name: 'resolution', type: this.renderer.PARAM_FLOAT3 },
        { name: 'metaballs', type: this.renderer.PARAM_FLOAT },
    ];

    public defines = [];

    frag =
        `precision lowp float;
        uniform vec4 metaballs[100];
        uniform vec3 resolution;    
        varying vec2 uv0;
   
        void main(){
            float x = uv0.x * resolution.x;
            float y = resolution.y- uv0.y * resolution.y;
            float v = 0.0;
            for (int i = 0; i < 100; i++) {
                vec4 mb = metaballs[i];
                float dx = mb.x - x;
                float dy = mb.y - y;
                float r = mb.z;
                v += r*r/(dx*dx + dy*dy);
            }
            if (v > 1.0) {
                // gl_FragColor = vec4(x/resolution.x, y/resolution.y, 0.0, 1.0);
                gl_FragColor = vec4(33.0/255.0, 166.0/255.0, 255.0/255.0, 1.0);
            } else {
                gl_FragColor = vec4(1.0, 0.0, 0.0, 0.0);
            }
            // if(x > resolution.x || y > resolution.y){
            //     gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
            // }
        }`;
}
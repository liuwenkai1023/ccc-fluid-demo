import { Shader } from "../Shader";

// Shader= Gray

export class CustomMask extends Shader {

    public name = "CustomMask";

    public params = [
        { name: 'resolution', type: this.renderer.PARAM_FLOAT3 },
        { name: 'metaballs', type: this.renderer.PARAM_FLOAT },
    ];

    public defines = [];

    public frag = `
    uniform sampler2D texture;
    uniform vec4 color;
    varying vec2 uv0;
    void main () {
        vec4 c = color * texture2D(texture, uv0);
        if(c.a > 0.925) {
            c.a = 1.0;
        }
        else{
            c.a = 0.0;
        }
        gl_FragColor = c;
    }
    `;

}
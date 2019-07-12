import { Shader } from "../Shader";

// Shader= Gray

export class CustomMask extends Shader {

    public name = "CustomMask";

    public params = [];

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
        else if(c.a > 0.90) {
            c.a = 0.2;
        }else{
            c.a = 0.0; 
        }
        gl_FragColor = c;
    }
    `;

}
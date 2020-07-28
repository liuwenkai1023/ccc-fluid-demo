import { ShaderLib } from "./ShaderLib";
import { SpriteHook } from "./SpriteHook";
import { ShaderCustomMaterial } from "./CustomMaterial";
import SingletonFactory from "./SingleFactory";

export enum ShaderType {
    Default,
    CustomMask,
    MetaBalls,
}

export class ShaderManager {
    // private static _instance: ShaderManager;
    constructor() {
        SpriteHook.init();
    }

    // public static getInstance() {
    //     if (!this._instance) {
    //         this._instance = new ShaderManager();
    //     }
    //     return this._instance;
    // }

    public setShader(_sprite: cc.Sprite, _shader: ShaderType, _handler?: { (mat: ShaderCustomMaterial) } | void) {
        // console.log(`【${_sprite.node.name}】->[setShader]->${ShaderType[_shader]}`);
        if (!_sprite) return;
        if (_shader == ShaderType.Default) {
            _sprite.setState(0);
            return;
        }

        let shaderName = ShaderType[_shader];
        let shader = SingletonFactory.getInstance(ShaderLib).getShader(shaderName);
        let sprite: any = <any>_sprite;
        let mat: ShaderCustomMaterial = sprite.getCustomMaterial(shaderName);

        if (!mat) {
            mat = new ShaderCustomMaterial(shader.name, shader.params, shader.defines);
            sprite.setCustomMaterial(shaderName, mat);
            mat.texture = _sprite.spriteFrame.getTexture();
        }

        sprite.activateCustomMaterial(shaderName);
        mat.texture.update();
        let scale = this.convertTotalScale(sprite.node);
        mat.setParamValue("resolution", new cc.Vec3(sprite.node.width * scale.x, sprite.node.width * scale.y));
        mat.setParamValue("texSize", new cc.Vec2(sprite.node.width * scale.x, sprite.node.width * scale.y));
        if (_handler) { _handler(mat); }
        return mat;
    }

    public convertTotalScale(node: cc.Node): cc.Vec2 {
        let viewScale = cc.v2(cc.view["_scaleX"], cc.view["_scaleY"]);
        let nodeScale = cc.v2(node.scaleX, node.scaleY);
        let totalScale = viewScale.scale(nodeScale);
        return totalScale;
    }

}
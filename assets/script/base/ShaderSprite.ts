import { ShaderType, ShaderManager } from "./extension/shader/ShaderManager";

const { ccclass, property, disallowMultiple, requireComponent, executeInEditMode } = cc._decorator;

@ccclass
@disallowMultiple
@executeInEditMode
@requireComponent(cc.Sprite)
export default class BaseShaderSprite extends cc.Component {

    @property({ visible: false })
    private _shader: ShaderType = ShaderType.Default;

    @property({ type: cc.Enum(ShaderType) })
    get shader() { return this._shader; }
    set shader(type) {
        this._shader = type;
        this.applyShaderSettings();
    }

    private sprite: cc.Sprite;

    protected start() {
        this.sprite = this.node.getComponent(cc.Sprite);
        this.applyShaderSettings();
    }

    private applyShaderSettings() {
        ShaderManager.instance().setShader(this.sprite, this._shader);
    }

    protected onDestroy() {
        CC_EDITOR && this.sprite && this.sprite.setState(0);
    }

}

import { ShaderManager, ShaderType } from "../../base/extension/shader/ShaderManager";
import SingletonFactory from "../../base/extension/shader/SingleFactory";
import { ShaderCustomMaterial } from "../../base/extension/shader/CustomMaterial";


const { ccclass, property } = cc._decorator;

@ccclass
export class MetaballsShader extends cc.Component {

    @property(cc.Sprite)
    private sprite: cc.Sprite = null;

    private mat: ShaderCustomMaterial;

    start() {
        this.mat = SingletonFactory.getInstance(ShaderManager).setShader(this.sprite, ShaderType.MetaBalls);
    }


    update() {
        if (this.mat) {
            let scale = SingletonFactory.getInstance(ShaderManager).convertTotalScale(this.sprite.node);
            this.mat.setParamValue("metaballs", this.balls);
            this.mat.setParamValue("resolution", new cc.Vec3(this.sprite.node.width * scale.x, this.sprite.node.height * scale.y));
        }
    }


    get balls(): cc.Node[] {
        let tmp = [];
        let node = this.sprite.node;
        for (const circle of cc.director.getScene().getComponentsInChildren(cc.PhysicsCircleCollider)) {
            let scale = SingletonFactory.getInstance(ShaderManager).convertTotalScale(circle.node);
            let position = node.convertToNodeSpace(circle.node.convertToWorldSpaceAR(cc.v2(0, 0)));
            tmp.push(position.x * cc.view[`_scaleX`]);
            tmp.push(position.y * cc.view[`_scaleY`]);
            tmp.push(circle.radius * scale.x);
            tmp.push(0);
        }
        return tmp;
    }

}
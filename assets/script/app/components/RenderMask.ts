// Learn TypeScript:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;

@ccclass
export default class RenderMask extends cc.Component {

    @property(cc.Camera)
    camera: cc.Camera = null;

    @property(cc.Mask)
    mask: cc.Mask = null;

    @property(cc.Sprite)
    sprite: cc.Sprite = null;

    private renderTexture: cc.RenderTexture;

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.renderTexture = new cc.RenderTexture();
        this.renderTexture.initWithSize(cc.winSize.width, cc.winSize.height);
        this.camera.targetTexture = this.renderTexture;
        this.renderTexture['_premultiplyAlpha'] = true;
    }

    start() {
        if (this.sprite) {
            this.sprite.node.active = true;
            this.sprite.spriteFrame = new cc.SpriteFrame(this.renderTexture);
            // this.sprite.spriteFrame.srcBlendFactor = cc.macro.BlendFactor.ONE;
        } 
        if(this.mask) {
            this.mask.node.active = true;
            this.mask.spriteFrame = new cc.SpriteFrame(this.renderTexture);
            this.mask.spriteFrame.srcBlendFactor = cc.macro.BlendFactor.ONE;
        }
    }

    // update (dt) {}
}

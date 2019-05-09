const { ccclass, property, requireComponent } = cc._decorator;

@ccclass
@requireComponent(cc.Button)
export default class SwitchScene extends cc.Component {

    @property
    nextScene: string = '';

    start() {
        this.node.on("click", () => {
            cc.director.loadScene(this.nextScene);
        });
    }

    // update (dt) {}
}

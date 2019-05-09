import PhysicsNodeLogic from "./PhysicsNodeLogic";

const { ccclass, property } = cc._decorator;

@ccclass
export default class GameViewLogic extends cc.Component {
    // LIFE-CYCLE CALLBACKS:

    @property(cc.Prefab)
    physicsNode: cc.Prefab = null;

    @property({ displayName: "墨迹长度", min: 1280, max: 12800 })
    drawLength: number = 1280;

    physicsNodeArr: cc.Node[] = [];

    touching: boolean;

    points: any;

    onLoad() {
        this.touching = false;
        this.node.on(cc.Node.EventType.TOUCH_START, this.touchStart.bind(this));
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this.touchMove.bind(this));
        this.node.on(cc.Node.EventType.TOUCH_END, this.touchEnd.bind(this));
        this.node.on(cc.Node.EventType.TOUCH_CANCEL, this.touchCancel.bind(this));
    }

    start() {
        this.touchStart(null);
        this.touchEnd(null);
    }

    onEnter() {
    }

    touchStart(event: cc.Event.EventTouch) {
        if (this.drawLength <= 0) {
            console.log("你墨水用完了");
            return;
        }
        // if (cc.find("Canvas/tag") && cc.find("Canvas/tag").active) {
        let physicsNode = cc.instantiate(this.physicsNode);
        physicsNode.getComponentInChildren(PhysicsNodeLogic).gameViewLogic = this;
        this.node.addChild(physicsNode);
        this.physicsNodeArr.push(physicsNode);
        return true;
        // }
        // return false;
    }

    touchMove(event: cc.Event.EventTouch) {

    }

    touchEnd(event: cc.Event.EventTouch) {
        // this.touching = false;
        // console.log("touchEnd", this.touching);
    }

    touchCancel(event: cc.Event.EventTouch) {
        // this.touching = false;
        // console.log("touchCancel", this.touching);
    }
}

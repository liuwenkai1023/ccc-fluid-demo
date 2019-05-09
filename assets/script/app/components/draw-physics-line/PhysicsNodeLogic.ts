const { ccclass, property } = cc._decorator;

// import MyPhysicsCollider = require("./MyPhysicsCollider")

import GameViewLogic from "./GameViewLogic";

@ccclass
export default class PhysicsNodeLogic extends cc.Component {

    touchStartHandler: () => void;
    touchMoveHandler: () => void;
    touchEndHandler: () => void;
    touchCancelHandler: () => void;

    drawLength: number = 0;

    curDrawLength: number = 0;

    path: cc.Graphics = null;

    dashPath: cc.Graphics = null;

    points: cc.Vec2[] = [];

    physicsLine = null;

    rigibodyLogic: cc.RigidBody = null;

    gameViewLogic: GameViewLogic;

    // LIFE-CYCLE CALLBACKS:    
    onLoad() {
        // this.touching = false;
        this.drawLength = this.gameViewLogic.drawLength;
        this.curDrawLength = 0;
        this.path = this.getComponent(cc.Graphics);
        this.path.strokeColor = cc.color(255, 0, 0);
        this.path.lineWidth = 6;

        this.dashPath = cc.find("dashedPath", this.node.getParent()).getComponent(cc.Graphics);
        this.dashPath.strokeColor = cc.color(255, 0, 0, 100);
        this.dashPath.lineWidth = 6;

        this.touchStartHandler = this.touchStart.bind(this);
        this.touchMoveHandler = this.touchMove.bind(this);
        this.touchEndHandler = this.touchEnd.bind(this);
        this.touchCancelHandler = this.touchCancel.bind(this);

        this.addTouch();
    }

    onDestroy() {
        this.removeTouch();
    }

    addTouch() {
        this.node.on(cc.Node.EventType.TOUCH_START, this.touchStartHandler);
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this.touchMoveHandler);
        this.node.on(cc.Node.EventType.TOUCH_END, this.touchEndHandler);
        this.node.on(cc.Node.EventType.TOUCH_CANCEL, this.touchCancelHandler);
    }

    removeTouch() {
        this.node.off(cc.Node.EventType.TOUCH_START, this.touchStartHandler);
        this.node.off(cc.Node.EventType.TOUCH_MOVE, this.touchMoveHandler);
        this.node.off(cc.Node.EventType.TOUCH_END, this.touchEndHandler);
        this.node.off(cc.Node.EventType.TOUCH_CANCEL, this.touchCancelHandler);
    }

    touchStart(event: cc.Event.EventTouch) {
        this.drawLength = this.gameViewLogic.drawLength;
        let touchLoc = event.getLocation();
        touchLoc = this.node.getParent().convertToNodeSpaceAR(touchLoc);
        this.points.push(cc.v2(touchLoc.x, touchLoc.y));
        this.path.moveTo(touchLoc.x, touchLoc.y);
        return true;
    }

    touchMove(event: cc.Event.EventTouch) {
        let touchLoc = event.getLocation();
        let lastTouchLoc = this.points[this.points.length - 1];
        if (this.curDrawLength >= this.drawLength) {
            console.log("你墨水用完了");
            this.drawLength = this.curDrawLength;
            this.touchEnd(null);
            this.removeTouch();
            return;
        }
        touchLoc = this.dashPath.node.convertToNodeSpaceAR(touchLoc);
        if (this.checkIsCanDraw(lastTouchLoc, touchLoc)) {
            // 射线检测
            let result = cc.director.getPhysicsManager().rayCast(this.dashPath.node.convertToWorldSpaceAR(lastTouchLoc), this.dashPath.node.convertToWorldSpaceAR(touchLoc), cc.RayCastType.Closest);
            if (result.length <= 0) {
                this.points.push(cc.v2(touchLoc.x, touchLoc.y));
                this.path.lineTo(touchLoc.x, touchLoc.y);
                this.path.stroke();
                this.dashPath.clear();
                this.curDrawLength += lastTouchLoc.sub(touchLoc).mag();
            } else {
                this.dashPath.clear();
                this.dashPath.moveTo(lastTouchLoc.x, lastTouchLoc.y);
                this.dashPath.lineTo(touchLoc.x, touchLoc.y)
                this.dashPath.stroke();
            }
        }
    }

    touchEnd(event: cc.Event.EventTouch) {
        // cc.director.resume();
        // this.touching = false;
        this.dashPath.clear();
        this.createRigibody();
        this.gameViewLogic.drawLength = this.drawLength - this.curDrawLength;
    }

    touchCancel(event: cc.Event.EventTouch) {
        // this.touching = false;
        // cc.director.resume();
        this.dashPath.clear();
        this.createRigibody();
        this.gameViewLogic.drawLength = this.drawLength - this.curDrawLength;
    }

    checkIsCanDraw(lastPoint: cc.Vec2, nowPoint: cc.Vec2) {
        return lastPoint.sub(nowPoint).mag() >= 10;;
    }

    // parsePathString(pathStr) {
    //     var pathList = pathStr.split(" ");
    //     let bezieConfig = {
    //         beginPos: cc.v2(0, 0),
    //         control1: cc.v2(0, 0),
    //         control2: cc.v2(0, 0),
    //         endPos: cc.v2(0, 0),
    //     };
    //     for (let i = 0, len = pathList.length; i < len; i++) {
    //         if (pathList[i] === "C") {
    //             bezieConfig.beginPos.x = parseFloat(pathList[i - 2]);
    //             bezieConfig.beginPos.y = parseFloat(pathList[i - 1]);
    //             bezieConfig.control1.x = parseFloat(pathList[i + 1]);
    //             bezieConfig.control1.y = parseFloat(pathList[i + 2]);
    //             bezieConfig.control2.x = parseFloat(pathList[i + 3]);
    //             bezieConfig.control2.y = parseFloat(pathList[i + 4]);
    //             bezieConfig.endPos.x = parseFloat(pathList[i + 5]);
    //             bezieConfig.endPos.y = parseFloat(pathList[i + 6]);
    //         }
    //     }
    //     // cc.log("zhangyakun" + JSON.stringify(pathList));
    // }

    createRigibody() {
        if (this.points.length > 1) {
            this.gameViewLogic.points = this.points;
        } else {
            return;
        }
        this.node.width = 0;
        this.node.height = 0;
        this.rigibodyLogic = this.addComponent(cc.RigidBody);
        this.physicsLine = this.addComponent("MyPhysicsCollider");
        this.physicsLine.lineWidth = this.path.lineWidth;
        this.physicsLine.points = this.points;
        this.rigibodyLogic.linearDamping = 1;
        this.rigibodyLogic.angularDamping = 1;
        this.rigibodyLogic.enabledContactListener = true;
        this.physicsLine.density = 1;
        this.physicsLine.apply();
    }

    getSegmenPos(beginPos: cc.Vec2, endPos: cc.Vec2) {
        let k = (endPos.y - beginPos.y) / (endPos.x - beginPos.x);
        let offX = 0;
        let offY = 0;
        if (k === 0) {
            offY = this.path.lineWidth / 2;
            offX = 0;

            if (endPos.x < beginPos.x) {
                offX = -offX;
                offY = -offY;
            }
        }
        else if (!isFinite(k)) {
            offX = this.path.lineWidth / 2;
            offY = 0;
        } else {
            let k1 = -1 / k;

            let angle = Math.atan(k1);
            let sin = Math.sin(angle);
            let cos = Math.cos(angle);
            cc.log("angle" + angle);

            offX = this.path.lineWidth / 2 * cos;
            offY = this.path.lineWidth / 2 * sin;
        }

        if (endPos.y > beginPos.y) {
            offX = -offX;
            offY = -offY;
        }

        let beingPosArr = [cc.v2(beginPos.x - offX, beginPos.y - offY), cc.v2(endPos.x - offX, endPos.y - offY)];
        let endPosArr = [cc.v2(beginPos.x + offX, beginPos.y + offY), cc.v2(endPos.x + offX, endPos.y + offY)];

        return {
            beginPosArr: beingPosArr,
            endPosArr: endPosArr
        };
    }
}

/****************************************************************************
 Copyright (c) 2013-2016 Chukong Technologies Inc.

 http://www.cocos.com

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated engine source code (the "Software"), a limited,
  worldwide, royalty-free, non-assignable, revocable and  non-exclusive license
 to use Cocos Creator solely to develop games on your target platforms. You shall
  not use Cocos Creator software for developing other software or tools that's
  used for developing games. You are not granted to publish, distribute,
  sublicense, and/or sell copies of Cocos Creator.

 The software or tools in this License Agreement are licensed, not sold.
 Chukong Aipu reserves all rights not expressly granted to you.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 ****************************************************************************/

var PTM_RATIO = cc.PhysicsManager.PTM_RATIO;

/**
 * @class PhysicsPolygonCollider
 * @extends PhysicsCollider
 * @uses Collider.Polygon
 */
var MyPhysicsCollider = cc.Class({
    // name: 'MyPhysicsCollider',
    extends: cc.PhysicsCollider,
    mixins: [cc.Collider.Polygon],

    properties: {
        lineWidth: 20,
    },

    editor: {
        menu: CC_EDITOR && 'i18n:MAIN_MENU.component.physics/Collider/MyCollider',
        // inspector: CC_EDITOR && 'packages://inspector/inspectors/comps/physics/points-base-collider.js',
        requireComponent: cc.RigidBody
    },

    _createShape: function (scale) {
        var shapes = [];

        var polys = this.points;

        var offset = this.offset;

        var polyIdx = 0;
        for (var i = 0; i < polys.length - 1; i++) {
            var posBegin = polys[i];
            var posEnd = polys[i + 1];

            var linelen = posBegin.sub(posEnd).mag(); // cc.pDistance(posBegin, posEnd);

            var angle = Math.atan2(posEnd.y - posBegin.y, posEnd.x - posBegin.x) - Math.PI / 2; //cc.pToAngle(cc.v2(posEnd.x - posBegin.x, posEnd.y - posBegin.y)) - Math.PI / 2;

            var midPos = posBegin.add(posEnd).mul(0.5)// cc.pMidpoint(posBegin, posEnd);

            var shape = new b2.PolygonShape();

            if (shape) {
                shape.SetAsBox(this.lineWidth / 2 / 32, linelen / 2 / 32, new b2.Vec2(midPos.x / 32, midPos.y / 32), angle);
                shapes.push(shape);
            }
        }

        return shapes;
    }
});

module.exports = MyPhysicsCollider;

import { __assign } from "tslib";
import { getPosition } from './get-position';
var Tracker = /** @class */ (function () {
    function Tracker(touch) {
        this.velocityMultiplier = window.devicePixelRatio;
        this.updateTime = Date.now();
        this.delta = { x: 0, y: 0 };
        this.velocity = { x: 0, y: 0 };
        this.lastPosition = { x: 0, y: 0 };
        this.lastPosition = getPosition(touch);
    }
    Tracker.prototype.update = function (touch) {
        var _a = this, velocity = _a.velocity, updateTime = _a.updateTime, lastPosition = _a.lastPosition;
        var now = Date.now();
        var position = getPosition(touch);
        var delta = {
            x: -(position.x - lastPosition.x),
            y: -(position.y - lastPosition.y),
        };
        var duration = (now - updateTime) || 16.7;
        var vx = delta.x / duration * 16.7;
        var vy = delta.y / duration * 16.7;
        velocity.x = vx * this.velocityMultiplier;
        velocity.y = vy * this.velocityMultiplier;
        this.delta = delta;
        this.updateTime = now;
        this.lastPosition = position;
    };
    return Tracker;
}());
export { Tracker };
var TouchRecord = /** @class */ (function () {
    function TouchRecord() {
        this._touchList = {};
    }
    Object.defineProperty(TouchRecord.prototype, "_primitiveValue", {
        get: function () {
            return { x: 0, y: 0 };
        },
        enumerable: true,
        configurable: true
    });
    TouchRecord.prototype.isActive = function () {
        return this._activeTouchID !== undefined;
    };
    TouchRecord.prototype.getDelta = function () {
        var tracker = this._getActiveTracker();
        if (!tracker) {
            return this._primitiveValue;
        }
        return __assign({}, tracker.delta);
    };
    TouchRecord.prototype.getVelocity = function () {
        var tracker = this._getActiveTracker();
        if (!tracker) {
            return this._primitiveValue;
        }
        return __assign({}, tracker.velocity);
    };
    TouchRecord.prototype.getEasingDistance = function (damping) {
        var deAcceleration = 1 - damping;
        var distance = {
            x: 0,
            y: 0,
        };
        var vel = this.getVelocity();
        Object.keys(vel).forEach(function (dir) {
            // ignore small velocity
            var v = Math.abs(vel[dir]) <= 10 ? 0 : vel[dir];
            while (v !== 0) {
                distance[dir] += v;
                v = (v * deAcceleration) | 0;
            }
        });
        return distance;
    };
    TouchRecord.prototype.track = function (evt) {
        var _this = this;
        var targetTouches = evt.targetTouches;
        Array.from(targetTouches).forEach(function (touch) {
            _this._add(touch);
        });
        return this._touchList;
    };
    TouchRecord.prototype.update = function (evt) {
        var _this = this;
        var touches = evt.touches, changedTouches = evt.changedTouches;
        Array.from(touches).forEach(function (touch) {
            _this._renew(touch);
        });
        this._setActiveID(changedTouches);
        return this._touchList;
    };
    TouchRecord.prototype.release = function (evt) {
        var _this = this;
        delete this._activeTouchID;
        Array.from(evt.changedTouches).forEach(function (touch) {
            _this._delete(touch);
        });
    };
    TouchRecord.prototype._add = function (touch) {
        if (this._has(touch)) {
            // reset tracker
            this._delete(touch);
        }
        var tracker = new Tracker(touch);
        this._touchList[touch.identifier] = tracker;
    };
    TouchRecord.prototype._renew = function (touch) {
        if (!this._has(touch)) {
            return;
        }
        var tracker = this._touchList[touch.identifier];
        tracker.update(touch);
    };
    TouchRecord.prototype._delete = function (touch) {
        delete this._touchList[touch.identifier];
    };
    TouchRecord.prototype._has = function (touch) {
        return this._touchList.hasOwnProperty(touch.identifier);
    };
    TouchRecord.prototype._setActiveID = function (touches) {
        this._activeTouchID = touches[touches.length - 1].identifier;
    };
    TouchRecord.prototype._getActiveTracker = function () {
        var _a = this, _touchList = _a._touchList, _activeTouchID = _a._activeTouchID;
        return _touchList[_activeTouchID];
    };
    return TouchRecord;
}());
export { TouchRecord };
//# sourceMappingURL=touch-record.js.map
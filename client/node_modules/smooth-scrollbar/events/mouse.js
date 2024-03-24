import { clamp } from '../utils';
import { isOneOf, getPosition, eventScope, setStyle, } from '../utils/';
var Direction;
(function (Direction) {
    Direction[Direction["X"] = 0] = "X";
    Direction[Direction["Y"] = 1] = "Y";
})(Direction || (Direction = {}));
export function mouseHandler(scrollbar) {
    var addEvent = eventScope(scrollbar);
    var container = scrollbar.containerEl;
    var _a = scrollbar.track, xAxis = _a.xAxis, yAxis = _a.yAxis;
    function calcMomentum(direction, clickPosition) {
        var size = scrollbar.size, limit = scrollbar.limit, offset = scrollbar.offset;
        if (direction === Direction.X) {
            var totalWidth = size.container.width + (xAxis.thumb.realSize - xAxis.thumb.displaySize);
            return clamp(clickPosition / totalWidth * size.content.width, 0, limit.x) - offset.x;
        }
        if (direction === Direction.Y) {
            var totalHeight = size.container.height + (yAxis.thumb.realSize - yAxis.thumb.displaySize);
            return clamp(clickPosition / totalHeight * size.content.height, 0, limit.y) - offset.y;
        }
        return 0;
    }
    function getTrackDirection(elem) {
        if (isOneOf(elem, [xAxis.element, xAxis.thumb.element])) {
            return Direction.X;
        }
        if (isOneOf(elem, [yAxis.element, yAxis.thumb.element])) {
            return Direction.Y;
        }
        return void 0;
    }
    var isMouseDown;
    var isMouseMoving;
    var startOffsetToThumb;
    var trackDirection;
    var containerRect;
    addEvent(container, 'click', function (evt) {
        if (isMouseMoving || !isOneOf(evt.target, [xAxis.element, yAxis.element])) {
            return;
        }
        var track = evt.target;
        var direction = getTrackDirection(track);
        var rect = track.getBoundingClientRect();
        var clickPos = getPosition(evt);
        if (direction === Direction.X) {
            var offsetOnTrack = clickPos.x - rect.left - xAxis.thumb.displaySize / 2;
            scrollbar.setMomentum(calcMomentum(direction, offsetOnTrack), 0);
        }
        if (direction === Direction.Y) {
            var offsetOnTrack = clickPos.y - rect.top - yAxis.thumb.displaySize / 2;
            scrollbar.setMomentum(0, calcMomentum(direction, offsetOnTrack));
        }
    });
    addEvent(container, 'mousedown', function (evt) {
        if (!isOneOf(evt.target, [xAxis.thumb.element, yAxis.thumb.element])) {
            return;
        }
        isMouseDown = true;
        var thumb = evt.target;
        var cursorPos = getPosition(evt);
        var thumbRect = thumb.getBoundingClientRect();
        trackDirection = getTrackDirection(thumb);
        // pointer offset to thumb
        startOffsetToThumb = {
            x: cursorPos.x - thumbRect.left,
            y: cursorPos.y - thumbRect.top,
        };
        // container bounding rectangle
        containerRect = container.getBoundingClientRect();
        // prevent selection, see:
        // https://github.com/idiotWu/smooth-scrollbar/issues/48
        setStyle(scrollbar.containerEl, {
            '-user-select': 'none',
        });
    });
    addEvent(window, 'mousemove', function (evt) {
        if (!isMouseDown)
            return;
        isMouseMoving = true;
        var cursorPos = getPosition(evt);
        if (trackDirection === Direction.X) {
            // get percentage of pointer position in track
            // then tranform to px
            // don't need easing
            var offsetOnTrack = cursorPos.x - startOffsetToThumb.x - containerRect.left;
            scrollbar.setMomentum(calcMomentum(trackDirection, offsetOnTrack), 0);
        }
        if (trackDirection === Direction.Y) {
            var offsetOnTrack = cursorPos.y - startOffsetToThumb.y - containerRect.top;
            scrollbar.setMomentum(0, calcMomentum(trackDirection, offsetOnTrack));
        }
    });
    addEvent(window, 'mouseup blur', function () {
        isMouseDown = isMouseMoving = false;
        setStyle(scrollbar.containerEl, {
            '-user-select': '',
        });
    });
}
//# sourceMappingURL=mouse.js.map
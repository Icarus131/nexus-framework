export function debounce(fn, wait, leading) {
    if (wait === void 0) { wait = 0; }
    var timer;
    var lastCalledAt = -Infinity;
    return function debouncedFn() {
        var _this = this;
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        if (leading) {
            var now = Date.now();
            var elapsed = now - lastCalledAt;
            lastCalledAt = now;
            if (elapsed >= wait) {
                fn.apply(this, args);
            }
        }
        clearTimeout(timer);
        timer = setTimeout(function () {
            fn.apply(_this, args);
        }, wait);
    };
}
//# sourceMappingURL=debounce.js.map
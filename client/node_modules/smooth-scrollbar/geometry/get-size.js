export function getSize(scrollbar) {
    var containerEl = scrollbar.containerEl, contentEl = scrollbar.contentEl;
    var containerStyles = getComputedStyle(containerEl);
    var paddings = [
        'paddingTop',
        'paddingBottom',
        'paddingLeft',
        'paddingRight',
    ].map(function (prop) {
        return containerStyles[prop] ? parseFloat(containerStyles[prop]) : 0;
    });
    var verticalPadding = paddings[0] + paddings[1];
    var horizontalPadding = paddings[2] + paddings[3];
    return {
        container: {
            // requires `overflow: hidden`
            width: containerEl.clientWidth,
            height: containerEl.clientHeight,
        },
        content: {
            // border width and paddings should be included
            width: contentEl.offsetWidth - contentEl.clientWidth + contentEl.scrollWidth + horizontalPadding,
            height: contentEl.offsetHeight - contentEl.clientHeight + contentEl.scrollHeight + verticalPadding,
        },
    };
}
//# sourceMappingURL=get-size.js.map
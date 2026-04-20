// Splits library: https://github.com/nathancahill/Split.js
var splits = Split(['#sourcetext', '#glows', "#printing"], { sizes: window.splitSectionWidths || [50, 3, 47], onDrag: splitdrag })
// splits.getSizes() returns current percentage widths; splits.setSizes([w1,w2]) resets them

function splitdrag() {
    var s = splits.getSizes(); // returns [width1, width2, width3]
    lastprintwidth = splits.getSizes()[2];
    GSedit.setwidth(0.01 * s[0] * window.innerWidth);
}

// initalize splits, so are in the correct place and don't jump on initial drag
splitdrag();
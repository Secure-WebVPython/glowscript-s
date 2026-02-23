// Splits library: https://github.com/nathancahill/Split.js
var splits = Split(['#sourcetext', '#glows', "#printing"], { sizes: [50, 0, 45], onDrag: splitdrag })
// splits.getSizes() returns current percentage widths; splits.setSizes([w1,w2]) resets them

function splitdrag() {
    var s = splits.getSizes() // returns [width1, width2, width3]
    lastprintwidth = splits.getSizes()[2]
    GSedit.setwidth(0.01 * s[0] * window.innerWidth)
}

(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define([], factory);
    } else if (typeof module === 'object' && module.exports) {
        module.exports = factory();
    } else {
        let exports = factory();
        root.pointInPoly = exports.pointInPoly;
        root.pointInXYPoly = exports.pointInXYPoly;
    }
}(typeof self !== 'undefined' ? self : this, function () {

// When the ray intersects a vertex, we must determine if it stays inside the
// angle formed by the two edges.  This is a simple check whether `y` falls
// between the two lines' end points.

// poly is an array of { x, y } elements
function ptinxypoly(x, y, poly) {
    let c = false;
    for (let l = poly.length, i = 0, j = l-1; i < l; j = i++) {
        let xj = poly[j].x, yj = poly[j].y, xi = poly[i].x, yi = poly[i].y;
        let where = (yi - yj) * (x - xi) - (xi - xj) * (y - yi);
        if (yj < yi) {
            if (y >= yj && y < yi) {
                if (where == 0) return true;    // point on the line
                if (where > 0) {
                    if (y == yj) {                // ray intersects vertex
                        if (y > poly[j == 0 ? l-1 : j-1].y) {
                            c = !c;
                        }
                    } else {
                        c = !c;
                    }
                }
            }
        } else if (yi < yj) {
            if (y > yi && y <= yj) {
                if (where == 0) return true;    // point on the line
                if (where < 0) {
                    if (y == yj) {                // ray intersects vertex
                        if (y < poly[j == 0 ? l-1 : j-1].y) {
                            c = !c;
                        }
                    } else {
                        c = !c;
                    }
                }
            }
        } else if (y == yi && (x >= xj && x <= xi || x >= xi && x <= xj)) {
            return true;     // point on horizontal edge
        }
    }
    return c;
}

// poly is an array of [ x, y ] elements
function ptinpoly(x, y, poly) {
    let c = false;
    for (let l = poly.length, i = 0, j = l-1; i < l; j = i++) {
        let xj = poly[j][0], yj = poly[j][1], xi = poly[i][0], yi = poly[i][1];
        let where = (yi - yj) * (x - xi) - (xi - xj) * (y - yi);
        if (yj < yi) {
            if (y >= yj && y < yi) {
                if (where == 0) return true;    // point on the line
                if (where > 0) {
                    if (y == yj) {                // ray intersects vertex
                        if (y > poly[j == 0 ? l-1 : j-1][1]) {
                            c = !c;
                        }
                    } else {
                        c = !c;
                    }
                }
            }
        } else if (yi < yj) {
            if (y > yi && y <= yj) {
                if (where == 0) return true;    // point on the line
                if (where < 0) {
                    if (y == yj) {                // ray intersects vertex
                        if (y < poly[j == 0 ? l-1 : j-1][1]) {
                            c = !c;
                        }
                    } else {
                        c = !c;
                    }
                }
            }
        } else if (y == yi && (x >= xj && x <= xi || x >= xi && x <= xj)) {
            return true;     // point on horizontal edge
        }
    }
    return c;
}

// exports
return { pointInPoly:ptinpoly, pointInXYPoly:ptinxypoly };
}));


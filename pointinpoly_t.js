

// browser vs nodejs
if (typeof module == 'object' && module.exports) {
	const pnp = require('./pointinpoly');
	global.pointInXYPoly = pnp.pointInXYPoly;
	global.pointInPoly = pnp.pointInPoly;
}

let total = 0;
let failed = 0;
function test(poly, tests) {
    let minx = Infinity, maxx = -Infinity, miny = Infinity, maxy = -Infinity;
    for (let i = 0; i < poly.length; i++) {
        let x = poly[i].x, y = poly[i].y;
        if (minx > x) minx = x;
        if (maxx < x) maxx = x;
        if (miny > y) miny = y;
        if (maxy < y) maxy = y;
    }
    maxx++;
    maxy++;
    let dx = Math.floor((maxx - minx) / 2);
    let dy = Math.floor((maxy - miny) / 2);

    // Test the passed-in poly
    for (let i = 0; i < tests.length; i++) {
        xy(tests[i][0], tests[i][1], tests[i][2], poly);
    }

    // Shift so the poly straddles the y axis
    let poly1 = poly.map(p => { return { x:p.x - dx, y:p.y } });
    for (let i = 0; i < tests.length; i++) {
        xy(tests[i][0], tests[i][1] - dx, tests[i][2], poly1);
    }

    // Shift so fully in the neg x space
    let poly2 = poly.map(p => { return { x:p.x - maxx, y:p.y } });
    for (let i = 0; i < tests.length; i++) {
        xy(tests[i][0], tests[i][1] - maxx, tests[i][2], poly2);
    }

    // Shift so the poly straddles the x and y axes
    let poly3 = poly.map(p => { return { x:p.x - dx, y:p.y - dy } });
    for (let i = 0; i < tests.length; i++) {
        xy(tests[i][0], tests[i][1] - dx, tests[i][2] - dy, poly3);
    }

    // Test the array-pair interface
    let poly4 = poly.map(p => [ p.x, p.y ]);
    for (let i = 0; i < tests.length; i++) {
        ap(tests[i][0], tests[i][1], tests[i][2], poly4);
    }

    // uses pointInXYPoly()
    function xy(expect, x, y, poly) {
        total++;
        if (expect != pointInXYPoly(x, y, poly)) {
            failed++;
            console.log('FAILED: expected ' + expect + ' on (' + x + ',' + y + ')' +
                    ', poly:' + poly.map(e => ' (' + e.x + ',' + e.y + ')'));
        }
    }
    // uses pointInPoly() (array pairs)
    function ap(expect, x, y, poly) {
        total++;
        if (expect != pointInPoly(x, y, poly)) {
            failed++;
            console.log('FAILED: expected ' + expect + ' on (' + x + ',' + y + ')' +
                    ', poly:' + poly.map(e => ' (' + e.x + ',' + e.y + ')'));
        }
    }
}

// Diamond with two points on the horizontal
//            3,1
//        1,3        5,3
//            3,5
function diamond() {
    let poly = [ {x:3,y:1}, {x:1,y:3}, {x:3,y:5}, {x:5,y:3} ];
    let tests = [
        // Points one pixel beyond edges
        [ false, 3, 0 ],
        [ false, 4, 1 ],
        [ false, 5, 2 ],
        [ false, 6, 3 ],
        [ false, 5, 4 ],
        [ false, 4, 5 ],
        [ false, 3, 6 ],

        [ false, 2, 1 ],
        [ false, 1, 2 ],
        [ false, 0, 3 ],
        [ false, 1, 4 ],
        [ false, 2, 5 ],

        // All points on the edges/vertices
        [ true,  3, 1 ],
        [ true,  2, 2 ],
        [ true,  1, 3 ],
        [ true,  2, 4 ],
        [ true,  3, 5 ],
        [ true,  4, 4 ],
        [ true,  5, 3 ],
        [ true,  4, 2 ],

        // All points in the middle
        [ true,  3, 2 ],
        [ true,  2, 3 ],
        [ true,  3, 3 ],
        [ true,  4, 3 ],
        [ true,  3, 4 ],
    ];
    test(poly,tests);
}

// Triangle with horizontal base
//            3,1
//        1,3     5,3
function triangle() {
    let poly = [ {x:3,y:1}, {x:1,y:3}, {x:5,y:3} ];
    let tests = [
        // All points on the edges/vertices
        [ true,  3, 1 ],
        [ true,  2, 2 ],
        [ true,  1, 3 ],
        [ true,  2, 3 ],
        [ true,  3, 3 ],
        [ true,  4, 3 ],
        [ true,  5, 3 ],
        [ true,  4, 2 ],

        // Points inside
        [ true,  2, 2 ],
        [ true,  3, 2 ],
        [ true,  4, 2 ],

        // Points beyond the triangle's base
        [ false, 0, 3 ],
        [ false, 6, 3 ],
    ];
    test(poly, tests);
}

// Chevron with tricky middle vertex
//              3,1
//            /     \
//        1,3   3,3   5,3
//         |  /     \  |
//        1,5         5,5
function chevron() {
    let poly = [ {x:3,y:1}, {x:1,y:3}, {x:1,y:5}, {x:3,y:3}, {x:5,y:5}, {x:5,y:3} ];
    let tests = [
        // row 3 : all points between 1,3 and 5,3 are in
        [ false, 0, 3 ],
        [ true,  1, 3 ],
        [ true,  2, 3 ],
        [ true,  3, 3 ],
        [ true,  4, 3 ],
        [ true,  5, 3 ],
        [ false, 6, 3 ],

        // row 4
        [ false, 0, 4 ],
        [ true,  1, 4 ],
        [ true,  2, 4 ],
        [ false, 3, 4 ],
        [ true,  4, 4 ],
        [ true,  5, 4 ],
        [ false, 6, 4 ],

        // row 5
        [ false, 0, 5 ],
        [ true,  1, 5 ],
        [ false, 2, 5 ],
        [ false, 3, 5 ],
        [ false, 4, 5 ],
        [ true,  5, 5 ],
        [ false, 6, 5 ],
    ];
    test(poly, tests);
}

// Complex poly that self intersects with inside "hole"
//                  5,1---9,1
//                /           \
//               /             \
//              /               \
//           1,5    5,5---9,5    13,5
//              \      \ /      /
//               \      X      /
//                \    / \    /
//                  5,9   9,9
function complex() {
    let poly = [ {x:5,y:1}, {x:1,y:5}, {x:5,y:9}, {x:9,y:5}, {x:5,y:5}, {x:9,y:9},
                 {x:13,y:5}, {x:9,y:1} ];
    let tests = [
        // row 1
        [ false,  4, 1 ],
        [ true,   5, 1 ],
        [ true,   7, 1 ],
        [ true,   9, 1 ],
        [ false, 10, 1 ],

        // row 3
        [ false,  2, 3 ],
        [ true,   3, 3 ],
        [ true,   5, 3 ],
        [ true,   7, 3 ],
        [ true,   9, 3 ],
        [ true,  11, 3 ],
        [ false, 12, 3 ],

        // row 5
        [ false,  0, 5 ],
        [ true,   1, 5 ],
        [ true,   2, 5 ],
        [ true,   3, 5 ],
        [ true,   4, 5 ],
        [ true,   5, 5 ],  // horizontal line
        [ true,   6, 5 ],  //     "       "
        [ true,   7, 5 ],  //     "       "
        [ true,   8, 5 ],  //     "       "
        [ true,   9, 5 ],  // horizontal line
        [ true,  10, 5 ],
        [ true,  11, 5 ],
        [ true,  12, 5 ],
        [ true,  13, 5 ],
        [ false, 14, 5 ],

        // row 6 - the hole
        [ false,  1, 6 ],
        [ true,   2, 6 ],
        [ true,   3, 6 ],
        [ true,   4, 6 ],
        [ true,   5, 6 ],
        [ true,   6, 6 ],
        [ false,  7, 6 ],  // the hole
        [ true,   8, 6 ],
        [ true,   9, 6 ],
        [ true,  10, 6 ],
        [ true,  11, 6 ],
        [ true,  12, 6 ],
        [ false, 13, 6 ],

        // row 7 - the cross-over
        [ false,  2, 7 ],
        [ true,   3, 7 ],
        [ true,   4, 7 ],
        [ true,   5, 7 ],
        [ true,   6, 7 ],
        [ true,   7, 7 ],  // the x-over
        [ true,   8, 7 ],
        [ true,   9, 7 ],
        [ true,  10, 7 ],
        [ true,  11, 7 ],
        [ false, 12, 7 ],

        // row 8
        [ false,  3, 8 ],
        [ true,   4, 8 ],
        [ true,   5, 8 ],
        [ true,   6, 8 ],
        [ false,  7, 8 ],  // under the x-over
        [ true,   8, 8 ],
        [ true,   9, 8 ],
        [ true,  10, 8 ],
        [ false, 11, 8 ],

        // row 9
        [ false,  4, 9 ],
        [ true,   5, 9 ],
        [ false,  6, 9 ],
        [ false,  7, 9 ],
        [ false,  8, 9 ],
        [ true,   9, 9 ],
        [ false, 10, 9 ],
    ];
    test(poly, tests);
}

// Run the tests
diamond();
triangle();
chevron();
complex();

console.log(total + ' tests, ' + failed + ' failures');

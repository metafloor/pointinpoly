# Point In Polygon

Determine if a point is inside of a polygon, including on vertexes/vertices and edges.

If you search stackexchange and the web in general, you will find dozens and dozens
of functions which claim to work.  The trouble is, they behave unreliably when a
point falls on a vertex or edge.  This algorithm is designed to work for all cases -
and to do it efficiently.

# Installation

```
npm install pointinpoly
```

# Usage

There are two functions exported by the module:

  - `pointInPoly(x, y, poly)` takes an array of `[ x, y ]` array pairs to define the
     polygon's shape.
  - `pointInXYPoly(x, y, poly)` takes an array of `{ x, y }` elements to define the
     polygon's shape.


# Node.js Example

``` js
var pointIn = require('pointinpoly').pointInPoly;    // use the array-pairs version
var triangle = [ [ 3,1 ], [ 1, 3 ], [ 5, 3 ] ];

// Test the top vertex
console.dir([
    pointIn(2, 1, triangle),
    pointIn(3, 1, triangle),
    pointIn(4, 1, triangle),
]);
// Test the middle
console.dir([
    pointIn(1, 2, triangle),
    pointIn(2, 2, triangle),
    pointIn(3, 2, triangle),
    pointIn(4, 2, triangle),
    pointIn(5, 2, triangle),
]);
// Test the bottom edge
console.dir([
    pointIn(0, 3, triangle),
    pointIn(1, 3, triangle),
    pointIn(3, 3, triangle),
    pointIn(5, 3, triangle),
    pointIn(6, 3, triangle),
]);
```

Output:

```
[ false, true, false ]
[ false, true, true, true, false ]
[ false, true, true, true, false ]
```

# To Use in the Browser

``` html
<script type="text/javascript" src="/path/to/pointinpoly/pointinpoly.js"></script>
```

The functions `pointInPoly()` and `pointInXYPoly()` will be defined globally.

# Testing

```
$ node pointinpoly_t.js
630 tests, 0 failures
```

The tests check against the following polygons (retro ASCII art).

Triangle

```
       x
      / \
     x---x
```

Diamond

```
       x
      / \
     x   x
      \ /
       x
```

Chevron

```
       x
      / \
     /   \
    x  x  x
    | / \ |
    x     x
```

Complex (edges that cross over creating a "hole")

```
       /\
      /  \
     /    \
    /      \
   x x----x x
   |  \  /  |    <-- hole in the center
   |   \/   |
   |   /\   |
   |  /  \  |
   | /    \ |
   x        x
```

# License

MIT

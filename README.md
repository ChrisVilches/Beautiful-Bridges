# Beautiful Bridges

This is a small web application for visualizing the [Beautiful Bridges](https://open.kattis.com/problems/beautifulbridges) problem, which appeared in the ACM-ICPC World Finals 2019 (competitive programming contest).

Source problem statement: https://open.kattis.com/problems/beautifulbridges

My solutions: solved in [C++](https://github.com/ChrisVilches/Algorithms/blob/main/kattis/beautifulbridges.cpp) and [Javascript](https://github.com/ChrisVilches/Algorithms/blob/main/kattis/beautifulbridges.js).

See a [live demo](http://cloud.chrisvilches.com/live_demos/beautiful-bridges/) (click on the *Sample* buttons).

## Tools

* Backbone.js
* Web Workers API
* Three.js
* Tailwind CSS + Flowbite
* MathJax
* esbuild

## Development

Lint and format:

```
npm run format
```

Watch file changes:

```
npm run tailwind:watch
npm run jshtml:watch
```

Build without watching file changes:

```
npm run build

# or

npm run tailwind:build
npm run jshtml:build
```

Then, open `dist/index.html` in the browser.

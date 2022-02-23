# Beautiful Bridges

[![Netlify Status](https://api.netlify.com/api/v1/badges/0b3322aa-db80-467c-85e8-54dd9a848997/deploy-status)](https://app.netlify.com/sites/beautiful-bridges/deploys)

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
* Webpack

## Development

Lint and format:

```
npm run format
```

Development server with hot reloading:

```
npm run dev
```

Build (create `/dist` folder):

```
npm run build:development
npm run build:production
```

# Kusema
A new social platform for university students.

## Installation
0. Install `npm` your preferred way, then type `npm install -g jspm` to install JSPM. You may need to do this as root or via `sudo`.
1. Point your terminal to `/Server` and type `npm install` to install server dependencies.
2. Point your terminal to `/Client` and type `jspm install` to install client dependencies.
3. Point your terminal to `/Server` and type `bin/kusema test` to run the server in development mode.

## Bundling
1. Go to `/Client`, and type `jspm bundle-sfx bootstrap.js build.js`
2. Comment the development section in `index.html`, and uncomment the production section. (to be made More Better soon!)

## Principles
- Mobile first
- Minimalist
- Realtime

## Supported browsers

Mobile:
- Chrome
- Safari
 
Desktop:
- Chrome
- Safari
- IE 11+

## Dev Notes
- [AngularJS best practices](https://github.com/mgechev/angularjs-style-guide)
- [API Reference](https://github.com/nathansherburn/kusema/wiki/API-Reference)

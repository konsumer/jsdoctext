# jsdoctext

A pure javascript port of [catdoc](https://www.wagner.pp.ru/~vitus/software/catdoc/)

Use it like this (in ES6) after `npm install --save jsdoctext`:

```js
import jsdoctext from 'jsdoctext'
import fs from 'fs'

console.log(jsdoctext(fs.readFileSync('word.doc','utf8').toString()))
```

Or like this in ES5:

```js
var jsdoctext = require('jsdoctext')
var fs = require('fs')

console.log(jsdoctext(fs.readFileSync('word.doc','utf8').toString()))
```

# jsdoctext

A pure javascript port of [catdoc](https://www.wagner.pp.ru/~vitus/software/catdoc/)

Use it like this (in ES6) after `npm install --save jsdoctext`:

```js
import jsdoctext from 'jsdoctext'
import fs from 'fs'

console.log(jsdoctext(fs.readFileSync('word.doc','utf8')))
```


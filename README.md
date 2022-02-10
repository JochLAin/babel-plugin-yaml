# @jochlain/babel-plugin-yaml

Babel plugin to transform YAML require to JSON  
Inspired from NPM package [babel-plugin-convert-to-json](https://www.npmjs.com/package/babel-plugin-convert-to-json)

## Installation

`npm i @jochlain/babel-plugin-yaml`

## Configuration

### Via `.babelrc.js` _(recommended)_

```js
module.exports = {
  // ...
  "plugins": [
    // ...
    "@jochlain/babel-plugin-yaml"
  ]
}
```

### Via cli

`babel --plugins @jochlain/babel-plugin-yaml index.js`

### Via Node

```js
require('@babel/core').transform('some code', {
    plugins: ['@jochlain/babel-plugin-yaml'],
});
```

## Usage

```yaml
# ./example.yaml
hello: "world"
```

```js
// ./index.js
import yaml from "./example.yaml";
// or
const yaml = require('./example.yaml');

console.log(yaml.hello); // => "world"
```

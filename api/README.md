# Nightwatch API Commands
Public commands api exported by Nightwatch in order to be extended upon from outside.

**Example:**

```js
const {Quit: quit} = require('nightwatch/api');

module.exports = CustomQuit extends Quit {
  async command(cb = function(r) {return r}) {
    console.log('from custom quit command');
    
    await super.command(cb);
  }
}
```

## Element commands:
  - ### Finding elements:
  - ### Element interaction:
  - ### Element state:
  - ### Element location:
  - ### Element location:

## Document handling:

## Session related:

## Navigation:

## Window related:

## Frames:

## User actions:

## User prompts:

## Mobile related:

## Utilities & Debugging:




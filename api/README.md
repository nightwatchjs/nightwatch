# Nightwatch API Commands
Public commands api exported by Nightwatch in order to be extended upon from outside.

**Example:**

<div class="code-example">
  <button class="copy-button" onclick="copyToClipboard(this)">Copy</button>
  <pre><code>
const {Quit: quit} = require('nightwatch/api');

module.exports = CustomQuit extends Quit {
  async command(cb = function(r) {return r}) {
    console.log('from custom quit command');
    
    await super.command(cb);
  }
}
  </code></pre>
</div>

**This is a work in progress.** 

## Element commands:
  - ### Finding elements:
    - [findElement](https://github.com/nightwatchjs/nightwatch/blob/main/lib/api/element-commands/findElement.js)
    - [findElements](https://github.com/nightwatchjs/nightwatch/blob/main/lib/api/element-commands/findElements.js)
    - [element](https://github.com/nightwatchjs/nightwatch/blob/main/lib/api/protocol/element.js)
    - [elements](https://github.com/nightwatchjs/nightwatch/blob/main/lib/api/protocol/elements.js)
    - [elementIdElement](https://github.com/nightwatchjs/nightwatch/blob/main/lib/api/protocol/elementIdElement.js)
    - [elementIdElements](https://github.com/nightwatchjs/nightwatch/blob/main/lib/api/protocol/elementIdElements.js)
    - [waitForElementPresent](https://github.com/nightwatchjs/nightwatch/blob/main/lib/api/element-commands/waitForElementPresent.js)
    - [waitForElementNotPresent](https://github.com/nightwatchjs/nightwatch/blob/main/lib/api/element-commands/waitForElementNotPresent.js)
    - [waitForElementVisible](https://github.com/nightwatchjs/nightwatch/blob/main/lib/api/element-commands/waitForElementVisible.js)
    - [waitForElementNotVisible](https://github.com/nightwatchjs/nightwatch/blob/main/lib/api/element-commands/waitForElementNotVisible.js)
  - ### Element interaction:
      - [clearValue](https://github.com/nightwatchjs/nightwatch/blob/main/lib/api/element-commands/clearValue.js)
      - [click](https://github.com/nightwatchjs/nightwatch/blob/main/lib/api/element-commands/click.js)
      - [moveToElement](https://github.com/nightwatchjs/nightwatch/blob/main/lib/api/element-commands/moveToElement.js)
      - [setValue](https://github.com/nightwatchjs/nightwatch/blob/main/lib/api/element-commands/setValue.js)
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

<script>
  function copyToClipboard(button) {
    const code = button.nextElementSibling.innerText;
    navigator.clipboard.writeText(code).then(() => {
      button.innerText = 'Copied!';
      setTimeout(() => {
        button.innerText = 'Copy';
      }, 2000);
    });
  }
</script>

<style>
  .code-example {
    position: relative;
  }

  .copy-button {
    position: absolute;
    top: 10px;
    right: 10px;
    background-color: #f5f5f5;
    border: 1px solid #ccc;
    padding: 5px 10px;
    cursor: pointer;
  }

  .copy-button:hover {
    background-color: #e0e0e0;
  }
</style>

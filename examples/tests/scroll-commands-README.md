# Scroll Commands for Nightwatch.js

This package provides a set of scroll commands for Nightwatch.js to help with scrolling operations in your tests.

## Available Commands

### `scrollTo(x, y, [callback])`
Scrolls the window to the specified position.

```javascript
// Scroll to specific coordinates
browser.scrollTo(0, 500);

// Scroll with options
browser.scrollTo({
  left: 0,
  top: 500,
  behavior: 'smooth'
});
```

### `scrollIntoView(selector, [options], [callback])`
Scrolls an element into view.

```javascript
// Basic usage
browser.scrollIntoView('#element-id');

// With options
browser.scrollIntoView('#element-id', {
  behavior: 'smooth',
  block: 'center',
  inline: 'nearest'
});
```

### `scrollToBottom([options], [callback])`
Scrolls to the bottom of the page.

```javascript
// Basic usage
browser.scrollToBottom();

// With options
browser.scrollToBottom({
  behavior: 'smooth'
});
```

### `scrollToTop([options], [callback])`
Scrolls to the top of the page.

```javascript
// Basic usage
browser.scrollToTop();

// With options
browser.scrollToTop({
  behavior: 'smooth'
});
```

## Options

All scroll commands accept an optional `options` object with the following properties:

- `behavior`: 'auto' | 'smooth' (default: 'auto')
  - 'auto': Instant scroll
  - 'smooth': Smooth scrolling animation

For `scrollIntoView`, additional options are available:
- `block`: 'start' | 'center' | 'end' | 'nearest' (default: 'center')
- `inline`: 'start' | 'center' | 'end' | 'nearest' (default: 'nearest')

## Examples

See [scrollCommandsExample.js](./scrollCommandsExample.js) for complete examples of using these commands in different scenarios.

## Best Practices

1. Always wait for elements to be visible before scrolling to them
2. Use smooth scrolling for better visual feedback in your tests
3. Consider adding small pauses after scroll operations to allow for animations
4. Use scroll commands in combination with assertions to verify scroll positions

## Common Use Cases

- Scrolling to load lazy-loaded content
- Navigating long pages
- Ensuring elements are visible before interaction
- Testing responsive layouts
- Verifying footer/header visibility
- Testing infinite scroll functionality

## Troubleshooting

If scroll commands are not working as expected:

1. Verify that the target element exists and is visible
2. Check if there are any CSS properties preventing scrolling
3. Ensure the page has enough content to scroll
4. Try using different scroll options (behavior, block, inline)
5. Add explicit waits before and after scroll operations 
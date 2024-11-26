# fusion

[![Version Badge][version-image]][project-url]
[![License][license-image]][license-url]
[![Build Status][build-image]][build-url]

> Reactive CSS-in-JS

## Install

Download the [CJS](https://github.com/ryanmorr/fusion/raw/master/dist/cjs/fusion.js), [ESM](https://github.com/ryanmorr/fusion/raw/master/dist/esm/fusion.js), [UMD](https://github.com/ryanmorr/fusion/raw/master/dist/umd/fusion.js) versions or install via NPM:

```sh
npm install @ryanmorr/fusion
```

## Usage

Fusion is a tiny CSS-in-JS library that combines declarative CSS building with reactive stores to create data to CSS variable bindings:

```javascript
import { css, store } from '@ryanmorr/fusion';

const color = store('red');

const style = css`
    .foo {
        color: ${color}
    }
`;

document.head.appendChild(style);

color.set('blue');
```

## API

### `store(value?)`

Create a reactive store that encapsulates a value and can notify subscribers when the value changes:

```javascript
import { store } from '@ryanmorr/fusion';

// Create a store with an initial value
const count = store(0);

// Get the store value
count.value(); //=> 0

// Set the store value
count.set(1);

// Set the store value with a callback function
count.update((val) => val + 1);

// Subscribe a callback function to be invoked when the value changes,
// it returns a function to unsubscribe from future updates
const unsubscribe = count.subscribe((nextVal, prevVal) => {
    // Do something
});
```

------

### `derived(...stores, callback)`

Create a reactive store that is based on the value of one or more other stores:

```javascript
import { derived, store } from '@ryanmorr/fusion';

const firstName = store('John');
const lastName = store('Doe');
const fullName = derived(firstName, lastName, (first, last) => `${first} ${last}`);

fullName.value(); //=> "John Doe"

firstName.set('Jane');

fullName.value(); //=> "Jane Doe"

// Subscribe to be notified of changes
const unsubscribe = fullName.subscribe((nextVal, prevVal) => {
    // Do something
});
```

If the callback function defines an extra parameter in its signature, the derived store is treated as asynchronous. The callback function is provided a setter for the store's value and no longer relies on the return value:

```javascript
import { derived, store } from '@ryanmorr/fusion';

const query = store();

// Perform an ajax request when the query changes
// and notify subscribers with the results
const results = derived(query, (string, set) => {
    fetch(`path/to/server/${encodeURIComponent(string)}`).then(set);
});
```

------

### `css(strings, ...values?)`

Create CSS stylesheets declaratively via tagged template literals with support for nested rules:

```javascript
import { css } from '@ryanmorr/fusion';

// Create a <style> element
const stylesheet = css`
    .foo {
        color: red;

        &:hover {
            color: blue;
        }

        @media (max-width: 750px) {
            & {
                color: purple;
            }
        }

        .bar {
            color: green;
        }
    }

    .baz {
        color: yellow;
    }
`;

// Append styles to document
document.head.appendChild(stylesheet);
```

#### Bindings

When a reactive store is interpolated into a `css` stylesheet, it is replaced with a unique CSS variable bound to that store and will be automatically updated when the internal store value changes:

```javascript
import { css, store } from '@ryanmorr/fusion';

const width = store('10px');

document.head.appendChild(css`
    .foo {
        width: ${width};
    }
`);

const element = document.querySelector('.foo');

getComputedStyle(element).getPropertyValue('width'); //=> "10px"

width.set('50px');

getComputedStyle(element).getPropertyValue('width'); //=> "50px"
```

Similarly to stores, promises can also be interpolated into a `css` stylesheet, setting the value of the binding CSS variable when the promise resolves:

```javascript
import { html } from '@ryanmorr/fusion';

const height = Promise.resolve('100px');

const style = css`
    .foo {
        height: ${height};
    }
`;
```

If a store or promise returns a value of null or undefined, the binding CSS variable will be unset.

------

### `style(strings, ...values?)`

Create styles for an element and its descendants declaratively via tagged template literals and return a unique class name. Just like `css`, it supports nested rules and interpolating stores and promises:

```javascript
import { style, store } from '@ryanmorr/fusion';

const color = store('red');

// Create a style declaration and return a class name
const className = style`
    width: 100px;

    &:hover {
        color: white;
    }

    .foo {
        color: ${color};
    }

    @media only screen and (max-width: 30em) {
        & {
            width: 200px;
        }
    }
`;

// Add the unique class to an element
element.classList.add(className);
```

------

### `keyframes(strings, ...values?)`

Create a keyframes animation via tagged template literals and return a unique animation name that can be easily applied to a `css` stylesheet or `style` class name declaration:

```javascript
import { keyframes, css } from '@ryanmorr/fusion';

// Create a keyframes animation
const slideIn = keyframes`
    from {
        transform: translateX(0%);
    }
    to {
        transform: translateX(100%);
    }
`;

// Add the animation to a `css` stylesheet
const stylesheet = css`
    .foo {
        animation: ${slideIn} 1s ease-in;
    }
`;
```

------

### `fallback(...values)`

Add one or more fallback values for a CSS variable, supporting stores, promises, and CSS variable names. Moving left to right, if the value provided is null or undefined then precedence moves to the next fallback value:

```javascript
import { fallback, store, css } from '@ryanmorr/fusion';

const color = store();

// Because the store is unset, it defaults to the fallback value of blue
const stylesheet = css`
    .foo {
        color: ${fallback(color, 'blue')};
    }
`;

// When the reactive store is set, it takes precedence
color.set('red');
```

------

### `media(mediaQuery)`

Create a reactive store for a media query that can also be interpolated into a `css` stylesheet or `style` declaration:

```javascript
import { media, css } from '@ryanmorr/fusion';

// Create the media query store
const smallScreen = media('(max-width: 750px)');

// Returns true if the media query currently matches
const isSmallScreen = smallScreen.value(); //=> true/false

// Interpolate the media query into a stylesheet
const style = css`
    ${smallScreen} {
        .foo {
            color: green;
        }
    }
`;

// Subscribers are called when the status of the media query changes
smallScreen.subscribe((isSmallScreen) => {
    // Do something
});
```

------

### `query(selector)`

Create a reactive store for a live array of DOM elements that match a CSS selector string. The store is automatically updated anytime one or more elements matching the CSS selector are added to or removed from the DOM. It can also be interpolated into a `css` stylesheet or `style` declaration:

```javascript
import { query, css } from '@ryanmorr/fusion';

// Create the element store
const fooElements = query('.foo');

// Returns an array of elements that match the CSS selector
const elements = fooElements.value();

// Interpolate the CSS selector into a stylesheet
const style = css`
    ${fooElements} {
        color: yellow;
    }
`;

// Subscribers are called when elements matching the
// CSS selector are added to or removed from the DOM
fooElements.subscribe((nextElements, prevElements) => {
    // Do something
});
```

## DOM

For a DOM-based solution, refer to [reflex](https://github.com/ryanmorr/reflex), a similar library that brings reactivity to elements and attributes. It is also 100% compatible with fusion.

## License

This project is dedicated to the public domain as described by the [Unlicense](http://unlicense.org/).

[project-url]: https://github.com/ryanmorr/fusion
[version-image]: https://img.shields.io/github/package-json/v/ryanmorr/fusion?color=blue&style=flat-square
[build-url]: https://github.com/ryanmorr/fusion/actions
[build-image]: https://img.shields.io/github/actions/workflow/status/ryanmorr/fusion/node.js.yml?style=flat-square
[license-image]: https://img.shields.io/github/license/ryanmorr/fusion?color=blue&style=flat-square
[license-url]: UNLICENSE
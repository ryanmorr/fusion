# fusion

[![Version Badge][version-image]][project-url]
[![License][license-image]][license-url]
[![Build Status][build-image]][build-url]

> Reactive CSS

## Install

Download the [CJS](https://github.com/ryanmorr/fusion/raw/master/dist/fusion.cjs.js), [ESM](https://github.com/ryanmorr/fusion/raw/master/dist/fusion.esm.js), [UMD](https://github.com/ryanmorr/fusion/raw/master/dist/fusion.umd.js) versions or install via NPM:

```sh
npm install @ryanmorr/fusion
```

## Usage

Fusion is a tiny CSS-in-JS library that combines declarative CSS building with reactive stores to create data to CSS variable bindings:

```javascript
import { css, val } from '@ryanmorr/fusion';

const color = val('red');

const style = css`
    .foo {
        color: ${color}
    }
`;

document.head.appendChild(style);

color.set('blue');
```

## API

### val(value?)

Create a reactive store that encapsulates a value and can notify subscribers when the value changes:

```javascript
import { val } from '@ryanmorr/fusion';

// Create a store with an initial value
const count = val(0);

// Get the store value
count.get(); //=> 0

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

### derived(...stores, callback)

Create a reactive store that is based on the value of one or more other stores:

```javascript
import { derived, val } from '@ryanmorr/fusion';

const firstName = val('John');
const lastName = val('Doe');
const fullName = derived(firstName, lastName, (first, last) => `${first} ${last}`);

fullName.get(); //=> "John Doe"

firstName.set('Jane');

fullName.get(); //=> "Jane Doe"

// Subscribe to be notified of changes
const unsubscribe = fullName.subscribe((nextVal, prevVal) => {
    // Do something
});
```

### css(strings, ...values?)

Create CSS stylesheets declaratively via tagged template literals:

```javascript
import { css } from '@ryanmorr/fusion';

// Create a <style> element
const style = css`
    .foo {
        color: red;
    }

    .bar {
        color: blue;
    }
`;
```

#### Bindings

When a reactive store is interpolated into a `css` stylesheet, it is replaced with a unique CSS variable bound to that store and will be automatically updated when the internal store value changes:

```javascript
import { css, val } from '@ryanmorr/reflex';

const width = val('10px');

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
import { html } from '@ryanmorr/reflex';

const height = Promise.resolve('100px');

const style = css`
    .foo {
        height: ${height};
    }
`;
```

If a store or promise returns a value of null or undefined, the binding CSS variable will be unset.

### fallback(...values)

Add one or more fallback values for a CSS variable, supporting stores, promises, and CSS variable names. Moving left to right, if the value provided is null or undefined then precedence moves to the next fallback value:

```javascript
import { fallback, val, css } from '@ryanmorr/fusion';

const store = val();
const promise = Promise.resolve('30px');

document.head.appendChild(css`
    .foo {
        width: ${fallback(store, promise, '--foo', '10px')};
    }
`);

const element = document.querySelector('.foo');

// The 3 previous values are unset, so precedence defaults to the right-most value
getComputedStyle(element).getPropertyValue('width'); //=> "10px"

// When the `--foo` CSS variable is set, it takes precedence
document.documentElement.style.setProperty('--foo', '20px');
getComputedStyle(element).getPropertyValue('width'); //=> "20px"

// Precedence movies to the promise when it resolves
await promise;
getComputedStyle(element).getPropertyValue('width'); //=> "30px"

// Finally, when the reactive store is set, it takes precedence over all the fallback values
store.set('40px');
getComputedStyle(element).getPropertyValue('width'); //=> "40px"
```

### media(mediaQuery)

Create a reactive store for a media query that can also be interpolated into a `css` stylesheet:

```javascript
import { media, css } from '@ryanmorr/fusion';

// Create the media query store
const smallScreen = media('(max-width: 750px)');

// Returns true if the media query currently matches
const isSmallScreen = smallScreen.get(); //=> true/false

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

### query(selector)

Create a reactive store for an array of DOM elements that match a CSS selector string. The store is automatically updated anytime one or more elements matching the CSS selector are added to or removed from the DOM. It can also be interpolated into a `css` stylesheet:

```javascript
import { query, css } from '@ryanmorr/fusion';

// Create the element store
const fooElements = query('.foo');

// Returns an array of elements that match the CSS selector
const elements = fooElements.get();

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

### keyframes(strings, ...values?)

Create a reactive store for a keyframes animation. When an element begins an animation created with `keyframes` it is automatically added to an internal array of the store, alerting subscribers. When the animation ends, the element is removed from the store's array, again notifying subscribers:

```javascript
import { keyframes, css } from '@ryanmorr/reflex';

// Create a keyframes animation
const slideIn = keyframes`
    from {
        transform: translateX(0%);
    }
    to {
        transform: translateX(100%);
    }
`;

// Returns an array of elements currently in the
// midst of the `slideIn` animation
const elements = slideIn.get();

// Interpolate the keyframes store where you would
// normally put the name of a keyframes animation
const stylesheet = css`
    .foo {
        animation: ${slideIn} 1s ease-in;
    }
`;

// Subscribers are called when elements start and end the animation
slideIn.subscribe((nextElements, prevElements) => {
    // Do something
});
```

## DOM

For a DOM-based solution, refer to [reflex](https://github.com/ryanmorr/reflex), a similar library that brings reactivity to elements and attributes. It is also 100% compatible with fusion.

## License

This project is dedicated to the public domain as described by the [Unlicense](http://unlicense.org/).

[project-url]: https://github.com/ryanmorr/fusion
[version-image]: https://img.shields.io/github/package-json/v/ryanmorr/fusion?color=blue&style=flat-square
[build-url]: https://travis-ci.com/github/ryanmorr/fusion
[build-image]: https://img.shields.io/travis/com/ryanmorr/fusion?style=flat-square
[license-image]: https://img.shields.io/github/license/ryanmorr/fusion?color=blue&style=flat-square
[license-url]: UNLICENSE
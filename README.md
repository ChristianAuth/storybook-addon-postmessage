# Storybook Addon PostMessage

The PostMessage Addon can be used to send post messages to the preview iframe of [Storybook](https://storybook.js.org).

## Installation

```sh
npm i -D storybook-addon-postmessage
```

## Configuration

### Registration

Create or edit `addons.js` in your .storybook configuration directory.

Add following content to it:

```js
import "storybook-addon-postmessage/register";
```

### Configuration

Create or edit `config.js` in your .storybook configuration directory.

Add following content to it:

```js
// Requirements
import { addParameters } from '@storybook/react';

// Configure post message
addParameters({
    postmessage: [
        {
        	  // The displayed text
            label: 'Lorem Ipsum',
            // Displayed as a "icon"
            code: 'LI',
            // Text color of the icon
            textColor: 'white',
            // Background color of the icon
            backgroundColor: '#E6370A',
            // The message that is sent via postMessage
            message: { ... },
            // This is active by default
            selected: true
        }
    ]
});
```

## Usage

Your components need to listen to postMessage and do something ...

# ChoirGenius API

"Api" access to ChoirGenius.

:warning: This library pretends to be a browser rather than using an api as real apis don't exist.

## Usage

Run the updating script.

```js
const ChoirGenius = require('choirgenius');

// Instantiate a new choir genius instance with the url of your site
const choirGenius = new ChoirGenius('https://hcamusic.org');

const username = process.env.CHOIR_GENIUS_USERNAME;
const password = process.env.CHOIR_GENIUS_PASSWORD;

// Log into choir genius, this must be called once before the other
// functions will work
await choirGenius.login(username, password);

// Fetch all your users and their data
const members = await choirGenius.getMembers();
```

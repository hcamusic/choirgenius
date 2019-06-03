# ChoirGenius API

"Api" access to ChoirGenius.

:warning: This library pretends to be a browser rather than using an api as real apis don't exist.

## Usage

Basic example

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

## API

**login** Logs you into the choir genius site, must be called once

```js
await choirGenius.login(username, password);
```

**getMembers** - Returns all of the members

```js
const members = await choirGenius.getMembers();
```

**emailEventAttendees** - Sends an email to event attendees  

```js
// Basic format
await choirGenius.emailEventAttendees(id, options);

// Options
await choirGenius.emailEventAttendees(id, {
  subject: 'Email Subject',
  body: 'Email Body',
  
  /**
  * all: Everyone who is invited
  * none: Everyone who has not responded yet
  * will: Everyone who plans to attend
  * wont: Everyone who plans not to attend
  * present: Everyone who actually attended
  * absent: Everyone who did not attend
  */
  sendTo: 'none',
  
  /**
  * do-not-reply: Do not allow replies
  * reply-to-me: Send replies directly to me
  */
  replyTo: 'do-not-reply',
  includeLinks: true,
});
```

```html
all: Everyone who is invited
none: Everyone who has not responded yet
will: Everyone who plans to attend
wont: Everyone who plans not to attend
present: Everyone who actually attended
absent: Everyone who did not attend
```

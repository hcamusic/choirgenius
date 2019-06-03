require('dotenv').config();

const ChoirGenius = require('../');

const choirGenius = new ChoirGenius('https://hcamusic.org');
const moment = require('moment');

const username = process.env.CHOIR_GENIUS_USERNAME;
const password = process.env.CHOIR_GENIUS_PASSWORD;

const main = async () => {
  const now = moment();
  const sixWeeks = moment().add(6, 'weeks');
  await choirGenius.login(username, password);

  const events = await choirGenius.getEvents(
    now.format(moment.HTML5_FMT.DATE),
    sixWeeks.format(moment.HTML5_FMT.DATE)
  );

  console.log(events);
};

main().catch(console.error);

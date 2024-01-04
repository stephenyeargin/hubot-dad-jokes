// Description
//   Load a dad joke from fatherhood.gov.
//
// Commands:
//   hubot dadjoke - display a joke
//
// Author:
//   stephenyeargin

const cachedBody = require('./cached-jokes.json');

module.exports = (robot) => {
  const apiUrl = 'https://fatherhood.gov/jsonapi/node/dad_jokes';

  const getRandomJoke = (data) => {
    const item = data[Math.floor(Math.random() * data.length)];
    robot.logger.debug(item);
    return `${item.attributes.field_joke_opener}\n\n\n${item.attributes.field_joke_response}`;
  };

  robot.respond(/dad\s?jokes?/, (msg) => robot.http(apiUrl)
    .get()((err, res, body) => {
      if (err || res.statusCode !== 200) {
        robot.logger.error(res?.statusCode, err || 'Unspecified');
        robot.logger.debug(body);
        robot.logger.warning('Using cached dad jokes instead ...');
        msg.send(getRandomJoke(cachedBody.data));
        return;
      }
      const json = JSON.parse(body);
      msg.send(getRandomJoke(json.data));
    }));
};

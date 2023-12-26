// Description
//   Load a dad joke from fatherhood.gov.
//
// Commands:
//   hubot dadjoke - display a joke
//
// Author:
//   stephenyeargin

module.exports = (robot) => {
  const apiUrl = 'https://fatherhood.gov/jsonapi/node/dad_jokes';
  return robot.respond(/dad\s?jokes?/, (msg) => robot.http(apiUrl)
    .get()((err, res, body) => {
      if (err) {
        robot.logger.error(err);
        msg.send('<Knock knock>\n\nWho\'s there?\n\nNot a joke because the API didn\'t respond with one.');
        return;
      }
      const json = JSON.parse(body);
      const item = json.data[Math.floor(Math.random() * json.data.length)];
      robot.logger.debug(item);
      msg.send(`${item.attributes.field_joke_opener} ${item.attributes.field_joke_response}`);
    }));
};

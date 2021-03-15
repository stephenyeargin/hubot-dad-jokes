# Description
#   Load a dad joke from fatherhood.gov.
#
# Commands:
#   hubot dadjoke - display a joke
#
# Author:
#   stephenyeargin

module.exports = (robot) ->
  apiUrl = 'https://fatherhood.gov/jsonapi/node/dad_jokes'
  robot.respond /dad\s?jokes?/, (msg) ->
    robot.http(apiUrl)
      .get() (err, res, body) ->
        if err
          handleError err, msg
          return
        json = JSON.parse(body)
        item = json.data[Math.floor(Math.random() * json.data.length)]
        robot.logger.debug item
        msg.send "#{item.attributes.field_joke_opener} #{item.attributes.field_joke_response}"

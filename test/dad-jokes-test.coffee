Helper = require('hubot-test-helper')
chai = require 'chai'
nock = require 'nock'

expect = chai.expect

helper = new Helper('../src/dad-jokes.coffee')

describe 'dad-jokes', ->
  beforeEach ->
    nock.disableNetConnect()
    @room = helper.createRoom()

  afterEach ->
    nock.cleanAll()
    @room.destroy()

  it 'retrieves a dad joke', (done) ->
    nock('https://fatherhood.gov')
      .get('/jsonapi/node/dad_jokes')
      .replyWithFile(200, __dirname + '/fixtures/dad_jokes.json')

    selfRoom = @room
    selfRoom.user.say('alice', '@hubot dadjoke')
    setTimeout(() ->
      try
        expect(selfRoom.messages).to.eql [
          ['alice', '@hubot dadjoke']
          ['hubot', 'Why did the scarecrow win an award? He was outstanding in his field.']
        ]
        done()
      catch err
        done err
      return
    , 1000)

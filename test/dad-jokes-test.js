/* eslint-disable func-names */
/* global describe beforeEach afterEach it */
const Helper = require('hubot-test-helper');
const chai = require('chai');
const nock = require('nock');

const {
  expect,
} = chai;

const helper = new Helper('../src/dad-jokes.js');

describe('dad-jokes', () => {
  beforeEach(function () {
    nock.disableNetConnect();
    this.room = helper.createRoom();
  });

  afterEach(function () {
    nock.cleanAll();
    this.room.destroy();
  });

  it('retrieves a dad joke', function (done) {
    nock('https://fatherhood.gov')
      .get('/jsonapi/node/dad_jokes')
      .replyWithFile(200, `${__dirname}/fixtures/dad_jokes.json`);

    const selfRoom = this.room;
    selfRoom.user.say('alice', '@hubot dadjoke');
    setTimeout(
      () => {
        try {
          expect(selfRoom.messages).to.eql([
            ['alice', '@hubot dadjoke'],
            ['hubot', 'Why did the scarecrow win an award?\n\n\nHe was outstanding in his field.'],
          ]);
          done();
        } catch (err) {
          done(err);
        }
      },
      1000,
    );
  });

  it('handles an error', function (done) {
    nock('https://fatherhood.gov')
      .get('/jsonapi/node/dad_jokes')
      .reply(403, 'An error occurred.');

    const selfRoom = this.room;
    selfRoom.user.say('alice', '@hubot dadjoke');
    setTimeout(
      () => {
        try {
          expect(selfRoom.messages[1][1]).length.to.be.greaterThan(10);
          done();
        } catch (err) {
          done(err);
        }
      },
      1000,
    );
  });
});

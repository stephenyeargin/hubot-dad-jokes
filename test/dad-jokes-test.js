const test = require('node:test');
const assert = require('node:assert/strict');
const nock = require('nock');
const { createTestBot } = require('./common/TestBot');

test('retrieves a dad joke', async () => {
  const ctx = await createTestBot();

  try {
    nock('https://fatherhood.gov')
      .get('/jsonapi/node/dad_jokes')
      .replyWithFile(200, `${__dirname}/fixtures/dad_jokes.json`);

    const response = await ctx.sendAndWaitForResponse('@hubot dadjoke');
    assert.equal(response, 'Why did the scarecrow win an award?\n\n\nHe was outstanding in his field.');
  } finally {
    ctx.shutdown();
  }
});

test('handles an error', async () => {
  const ctx = await createTestBot();

  try {
    nock('https://fatherhood.gov')
      .get('/jsonapi/node/dad_jokes')
      .reply(403, 'An error occurred.');

    const response = await ctx.sendAndWaitForResponse('@hubot dadjoke');
    assert.ok(response.length > 10);
  } finally {
    ctx.shutdown();
  }
});

const { getFeed } = require('./feedService');

exports.handler = async (event) => {
  const items = await getFeed();
  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(items),
  };
};

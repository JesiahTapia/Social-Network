const sdk = require("node-appwrite");

module.exports = async function (req, res) {
  const client = new sdk.Client();

  const database = new sdk.Databases(client);
  const { tweetId, likes } = JSON.parse(req.payload)

  if (
    !req.variables['APPWRITE_FUNCTION_ENDPOINT'] ||
    !req.variables['APPWRITE_FUNCTION_API_KEY']
  ) {
    console.warn("Environment variables are not set. Function cannot use Appwrite SDK.");
  } else {
    client
      .setEndpoint(req.variables['APPWRITE_FUNCTION_ENDPOINT'])
      .setProject(req.variables['APPWRITE_FUNCTION_PROJECT_ID'])
      .setKey(req.variables['APPWRITE_FUNCTION_API_KEY'])
      .setSelfSigned(true);
    
    let newTweet = {}
    if (tweetId) {
      try {
        newTweet = await database.updateDocument(
          '63f6a34359d6650eea24',
          '63f6a37f0591a0dd62b6',
          tweetId,
          { likes }
        );
        console.log('NEW TWEET: ', newTweet)
        return res.json({ data: newTweet });
      } catch (error) {
        console.log(error)
        return res.json({error})
      }
    }
  }
};
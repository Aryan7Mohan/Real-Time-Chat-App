const router = require("express").Router();
const { MongoClient } = require("mongodb");

require("dotenv").config();

const client = new MongoClient(process.env.MONGO_AUTOC);
var collection;

async function connectToDB() {
    try {
        await client.connect();
        collection = client.db("ChatDB").collection("users");
        console.log('Autocomplete DB connected!')
      } catch (e) {
        console.log(e);
      }
}
connectToDB();


router.get("", async (request, response) => {
    try {
      let result = await collection.aggregate([
          {
              "$search": {
                  "autocomplete": {
                      "query": `${request.query.term}`,
                      "path": "username",
                      "fuzzy": {
                          "maxEdits": 2
                      }
                  }
              }
          }
      ]).toArray();
      response.send(result);
    } catch (e) {
      response.status(500).send({ message: e.message });
    }
  });

module.exports = router;
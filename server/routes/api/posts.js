const express = require("express");
const req = require("express/lib/request");
const mongodb = require("mongodb");

const router = express.Router();

// Get Posts
router.get("/", async (req, res) => {
  const posts = await loadPostCollection();
  res.send(await posts.find({}).toArray());
});

// Add Post
router.post("/", async (req, res) => {
  const posts = await loadPostCollection();
  await posts.insertOne({
    text: req.body.text,
    createdAt: new Date(),
  });
  res.status(201).send();
});

// Update Post
router.put("/:id", async (req, res) => {
  const posts = await loadPostCollection();
  await posts.updateOne({_id: req.params.id}, {$set: {"text": req.body.text, "createdAt": new Date()}},{ upsert: false });
  res.status(201).send();
});

// Delete Post
router.delete("/:id", async (req, res) => {
  const posts = await loadPostCollection();
  await posts.deleteOne({ _id: new mongodb.ObjectId(req.params.id) });
  res.status(200).send();
});

// Environment Variables for Secrets
const username = process.env["DB_USERNAME"]
const password = process.env["DB_PASSWORD"]

// Connect to MongoDB
async function loadPostCollection() {
  const client = await mongodb.MongoClient.connect(
    `mongodb+srv://${username}:${password}@cluster0.c4wvu.mongodb.net/Cluster0?retryWrites=true&w=majority`,
    {
      useNewUrlParser: true,
    }
  );

  return client.db("vue_express").collection("posts");
}

module.exports = router;

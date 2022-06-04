const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://appuser:37anypwD8H5kIbXu@cluster0.qnz1h.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
client.connect(err => {
  const collection = client.db("posts").collection("content");
  // perform actions on the collection object
  print(collection);
  client.close();
});
// 01 Basic Setup
const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
const port = process.env.PORT || 5000;

const app = express();

// 02 Middleware
app.use(cors());
app.use(express.json());

// 05 New DataBase User
// assinmentKenno12
// xhQc7AgNK7qnU1uk

// 07 Database Connect > Connect your Application

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PSAAWORD}@cluster0.athiem3.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});
console.log(uri);

// 08
async function run() {
  try {
    // Show 3 Category to the Home pge
    const categoryCollection = client
      .db("kennoAssinment12")
      .collection("homeCategory");

    // Show Oppo Page
    const allCategoriesCollection = client
      .db("kennoAssinment12")
      .collection("allCategories");

    // 09 Data Load Show Home Page 3 Categoey
    app.get("/homeCategory", async (req, res) => {
      const query = {};
      const cursor = categoryCollection.find(query);
      const homeCategory = await cursor.toArray();
      res.send(homeCategory);

      app.get("/homeCategory/:id", async (req, res) => {
        const id = req.params.id;
        const query = { _id: ObjectId(id) };
        const homeCategory = await categoryCollection.findOne(query);
        res.send(homeCategory);
      });
    });

    app.get("/allCategories", async (req, res) => {
      const query = {};
      const cursor = allCategoriesCollection.find(query);
      const allCategories = await cursor.toArray();
      res.send(allCategories);

      app.get("/allCategories/:id", async (req, res) => {
        const id = req.params.id;
        console.log(id);
        // const query = { _id: ObjectId(id) };
        let query = { catagoryId: id };
        const cursor = allCategoriesCollection.findOne(query);
        const allCategories = await cursor.toArray();
        res.send(allCategories);
      });
    });

    // 10 Show All Qategory
    // app.get("/allCategories", async (req, res) => {
    //   const query = {};
    //   const cursor = allCategoriesCollection.find(query);
    //   const allCategories = await cursor.toArray(query);
    //   res.send(allCategories);

    //   app.get("/allCategories/:id", async (req, res) => {
    //     const id = req.query.id;
    //     console.log(id);
    //     let query = { catagoryId: id };
    //     const cursor = allCategoriesCollection.find(query);
    //     const allCategories = await cursor.toArray();
    //     res.send(allCategories);
    //   });
    // });

    app.get("/oppoCategory", async (req, res) => {
      const query = {};
      const cursor = oppoCollection.find(query);
      const oppoCategory = await cursor.toArray();
      res.send(oppoCategory);

      app.get("/oppoCategory/:id", async (req, res) => {
        const id = req.params.id;
        const query = { _id: ObjectId(id) };
        const oppoCategory = await oppoCollection.findOne(query);
        res.send(oppoCategory);
      });
    });

    // 10 Single Data Load
    // 08 singleService data load to a page with full spacification
  } finally {
  }
}
run().catch((error) => console.error(error));

// 06
// DB_USER=kennoAssinment12
// DB_PSAAWORD=homeCategory

app.get("/", (req, res) => {
  res.send("Kenno server is running");
});

// 04 Kenno running on : 6000 port on Commend line
app.listen(port, () => {
  console.log(`Kenno running on : ${port}`);
});

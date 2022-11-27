// 01 Basic Setup
const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
const port = process.env.PORT || 5000;

// const jwt = require("jsonwebtoken");

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

// 08
async function run() {
  try {
    // 06 Show 3 category and 6 Product Collection
    const productCollection = client
      .db("kennoAssinment12")
      .collection("categoryProduct");

    // 07 Show 3 category and 6 Product
    app.get("/category", async (req, res) => {
      const query = {};
      const options = await productCollection.find(query).toArray();
      res.send(options);
    });
    app.get("/category/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const carService = await productCollection.findOne(query);
      res.send(carService);
    });

    // booking
    const bookingCollection = client
      .db("kennoAssinment12")
      .collection("booking");
    app.get("/bookings", async (req, res) => {
      const email = req.query.email;
      const query = { email: email };
      const bookings = await bookingCollection.find(query).toArray();
      res.send(bookings);
    });
    app.post("/bookings", async (req, res) => {
      const booking = req.body;
      console.log(booking);
      const result = await bookingCollection.insertOne(booking);
      res.send(result);
    });

    //  find alluser
    app.get("/allUser", (req, res) => {
      UsersCollection.find({}).toArray((arr, document) => {
        res.send(document);
      });
    });
    app.get("/jwt", async (req, res) => {
      const email = req.query.email;
      const query = { email: email };
      const user = await UsersCollection.findOne(query);
      if (user) {
        const token = jwt.sign;
      }
      res.send({ accessToken: "token" });
    });

    app.post("/users", async (req, res) => {
      const user = req.body;
      console.log(user);
      const result = await UsersCollection.insertOne(user);
      res.send(result);
    });

    // is admin chaeck

    app.get("/isAdmin", (req, res) => {
      const email = req.body.email;
      adminCollection.find({ email: email }).toArray((arr, document) => {
        res.send(document.length > 0);
      });
    });
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

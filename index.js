// 01 Basic Setup 15(Verify JWT 29)

const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const jwt = require("jsonwebtoken");
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

// 15 Veryfy JWT
function verifyJWT(req, res, next) {
  console.log("Token Inside verify JWT", req.headers.authorization);
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).send("unsuthorize access");
  }
  const token = authHeader.split(" ")[1];

  jwt.verify(token, process.env.ACCESS_TOKEN, function (err, decoded) {
    if (err) {
      return res.status(403).send({ message: "forbiden access" });
    }
    req.decoded = decoded;
    next();
  });
}

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

    // Booking Collection Show
    const bookingCollection = client
      .db("kennoAssinment12")
      .collection("booking");

    app.get("/bookings", verifyJWT, async (req, res) => {
      const email = req.query.email;
      const decodedEmail = req.decoded.email;
      if (email !== decodedEmail) {
        return res.status(403).send({ message: "forbidenn access" });
      }
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

    // See All Admin Here
    // const adminCollection = client.db("kennoAssinment12").collection("admin");
    // app.get("/isAdmin", (req, res) => {
    //   const email = req.body.email;
    //   adminCollection.find({ email: email }).toArray((arr, document) => {
    //     res.send(document.length > 0);
    //   });
    // });

    // Jwt
    app.get("/jwt", async (req, res) => {
      const email = req.query.email;
      const query = { email: email };
      const user = await usersCollection.findOne(query);
      console.log(user);
      if (user) {
        const token = jwt.sign({ email }, process.env.ACCESS_TOKEN, {
          expiresIn: "7d",
        });
        return res.send({ accessToken: token });
      }
      res.status(403).send({ accessToken: "" });
    });

    // All Users
    const usersCollection = client.db("kennoAssinment12").collection("users");
    app.post("/users", async (req, res) => {
      const user = req.body;
      console.log(user);
      const result = await usersCollection.insertOne(user);
      res.send(result);
    });

    app.get("/users", (req, res) => {
      const query = {};
      const users = usersCollection.find(query).toArray();
      res.send(users);
    });
    //  find alluser
    app.get("/alluser", (req, res) => {
      usersCollection.find({}).toArray((arr, document) => {
        res.send(document);
      });
    });

    app.put("/alluser/admin/:id", verifyJWT, async (req, res) => {
      const decodedEmail = req.decoded.email;
      const query = { email: decodedEmail };
      const user = await usersCollection.findOne(query);
      if (user?.role !== "admin") {
        return res
          .status(403)
          .send({ message: "forbidden access Check Admin" });
      }
      const id = req.params.id;
      const filter = { _id: ObjectId(id) };
      const options = { upsert: true };
      const updatedDoc = {
        $set: {
          role: "admin",
        },
      };
      const result = await usersCollection.updateOne(
        filter,
        updatedDoc,
        options
      );
      res.send(result);
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

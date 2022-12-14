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
  const authHeader = req.headers.authorization;
  console.log(authHeader);
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

    const usersCollection = client.db("kennoAssinment12").collection("users");

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
      console.log(email, decodedEmail);
      if (email !== decodedEmail) {
        return res.status(403).send({ message: "forbidenn access" });
      }
      const query = { email: email };
      const bookings = await bookingCollection.find(query).toArray();
      res.send(bookings);
    });

    app.post("/bookings", async (req, res) => {
      const booking = req.body;

      const result = await bookingCollection.insertOne(booking);
      res.send(result);
    });

    // Jwt
    app.get("/jwt", async (req, res) => {
      const email = req.query.email;
      const query = { email: email };
      const user = await usersCollection.findOne(query);
      console.log(user, email);
      if (user) {
        const token = jwt.sign({ email }, process.env.ACCESS_TOKEN, {
          expiresIn: "7d",
        });
        return res.send({ accessToken: token });
      }
      res.status(403).send({ accessToken: "" });
    });

    // Show All Users
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

    // Show all seller
    app.get("/user/sellers", async (req, res) => {
      const option = {};
      // const query = { option }
      const options = await usersCollection.find({ role: "seller" }).toArray();
      res.send(options);
    });

    // Delete Seller Using Click Handleing
    app.delete("/user/sellers/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: ObjectId(id) };
      const result = await usersCollection.deleteOne(filter);
      res.send(result);
    });

    app.get("/user/sellers/:email", async (req, res) => {
      const email = req.params.email;
      const query = { email };
      const user = await usersCollection.findOne(query);
      res.send({ isSeller: user?.role == "seller" });
    });

    // get Seller email and make Seller Route
    app.get("/user/sellers/:email", async (req, res) => {
      const email = req.params.email;
      const query = { email };
      const user = await usersCollection.findOne(query);
      res.send({ isBuyer: user?.role === "seller" });
    });

    // Show all Buyer
    app.get("/user/buyers", async (req, res) => {
      const option = {};
      const options = await usersCollection.find({ role: "buyer" }).toArray();
      res.send(options);
    });

    // Delete Buyer Click Handleing
    app.delete("/user/buyers/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: ObjectId(id) };
      const result = await usersCollection.deleteOne(filter);
      res.send(result);
    });

    // get Buyer email and make Buyer Route
    app.get("/user/buyers/:email", async (req, res) => {
      const email = req.params.email;
      const query = { email };
      const user = await usersCollection.findOne(query);
      res.send({ isBuyer: user?.role === "buyer" });
    });

    // Check a user Admin or Not useAdmin.js (DashBoardLayout.js 6)
    app.get("/alluser/admin/:email", async (req, res) => {
      const email = req.params.email;
      const query = { email };
      const user = await usersCollection.findOne(query);
      res.send({ isAdmin: user?.role == "admin" });
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

    // Find Product Category from productCollection
    app.get("/productCategory", async (req, res) => {
      const query = {};
      const result = await productCollection
        .find(query)
        .project({ brandName: 1 })
        .toArray();
      res.send(result);
    });

    // Add Product Collection
    const addProductCollection = client
      .db("kennoAssinment12")
      .collection("addproduct");

    // Add Product
    app.get("/products", async (req, res) => {
      const query = {};
      const result = await addProductCollection.find(query).toArray();
      res.send(result);
    });
    app.post("/products", async (req, res) => {
      const product = req.body;
      const result = await addProductCollection.insertOne(product);
      res.send(result);
    });

    app.delete("/products/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: ObjectId(id) };
      const result = await addProductCollection.deleteOne(filter);
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

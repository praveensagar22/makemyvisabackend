const express = require("express");
const collection = require("./mongo");
const cors = require("cors");
const crypto = require("crypto"); // Add the crypto module
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Hashing function using MD5
function hashPassword(password) {
  return crypto.createHash("md5").update(password).digest("hex");
}

app.get("/", cors(), (req, res) => {
  // Your code for the "/" route
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const check = await collection.findOne({ email: email });

    if (check) {
      // Compare hashed passwords
      if (check.password === hashPassword(password)) {
        res.json("exist");
      } else {
        res.json("invalidPassword");
      }
    } else {
      res.json("notexist");
    }
  } catch (e) {
    res.json("fail");
  }
});

app.post("/signup", async (req, res) => {
  const { email, password } = req.body;

  const data = {
    email: email,
    password: hashPassword(password), // Hash the password before storing
  };

  try {
    const check = await collection.findOne({ email: email });

    if (check) {
      res.json("exist");
    } else {
      res.json("notexist");
      await collection.insertMany([data]);
    }
  } catch (e) {
    res.json("fail");
  }
});

app.listen(8000, () => {
  console.log("port connected");
});

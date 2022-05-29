const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const helmet = require("helmet");
const morgan = require("morgan");
const userRoute = require("./routes/users");
const authRoute = require("./routes/auth");
const postRoute = require("./routes/posts");

dotenv.config();
mongoose
  .connect(
    process.env.MONGO_URL,
    {
      useNewURLParser: true,
      useUnifiedTopology: true,
    },
    6000000
  )

  .then(console.log("connected to server"))
  .catch((err) => console.log(err));

// middleware

app.use(express.json());
app.use(helmet());
app.use(morgan("common")); // morgan is a logger

app.use("/api/users", userRoute);
app.use("/api/auth", authRoute);
app.use("/api/posts", postRoute);

app.get("/", (req, res) => {
  res.send("welcome to homepage");
});

app.listen(3000, () => {
  console.log("server started");
});

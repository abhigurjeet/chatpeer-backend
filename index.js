require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const userRouter = require("../server/Routes/userRoute");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();
const PORT = process.env.PORT || 3001;

//Connect to database
main().catch((err) => console.log(err));
async function main() {
  await mongoose.connect(process.env.DB_URL);
}

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use((req, res, next) => {
  res.header("Access-Control-Expose-Headers", "Authorization");
  next();
});
app.use("/", userRouter);

app.listen(PORT, (res) => {
  console.log("Server up and running");
});

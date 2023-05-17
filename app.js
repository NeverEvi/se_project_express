const express = require("express");
const mongoose = require("mongoose");

const { PORT = 3001 } = process.env;
const app = express();

mongoose.connect("mongodb://127.0.0.1:27017/wtwr_db");
app.use((req, res, next) => {
  req.userId = {
    _id: "6464f05fa4cee3ff70ab6a2b",
  };
  next();
});
const routes = require("./routes");
app.use(express.json());
app.use(routes);

module.exports.createItem = (req, res) => {
  console.log(req.user._id);
};

app.listen(PORT, () => {
  console.log(`App listening at port ${PORT}`);
  console.log(`Woohoo`);
});
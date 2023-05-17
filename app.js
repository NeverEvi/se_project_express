const express = require("express");
const mongoose = require("mongoose");
const { addId } = require("./middlewares/middlewares");

const { PORT = 3001 } = process.env;
const app = express();

mongoose.connect("mongodb://127.0.0.1:27017/wtwr_db");
app.use(addId);
const routes = require("./routes");

app.use(express.json());
app.use(routes);

app.listen(PORT, () => {
  console.log(`App listening at port ${PORT}`);
  console.log(`Woohoo`);
});

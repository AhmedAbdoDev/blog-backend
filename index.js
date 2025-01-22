const express = require("express");
const app = express();

const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();

app.use(bodyParser.json());
app.use(cors());

require("./Database/connect");
let api = require("./routes/api");
app.use("/api/", api);
let PORT = process.env.PORT;
app.listen(PORT, () =>
  console.log(`Server is running on http://localhost:${PORT}`)
);

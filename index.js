const express = require("express");
const server = express();
const PORT = process.env.PORT || 5000;

const db = require("./data/data-model");

server.listen(PORT, () => console.log(`Listening on ${PORT}`));

import * as express from "express";

var app = express();
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./swagger.json");

var options = {
  explorer: true
};

app.use("/swagger", swaggerUi.serve, swaggerUi.setup(swaggerDocument, options));

app.get("/home", (req, res, next) => {
  res.send("Hello World");
});

app.get("/values/:id/:count", (req, res, next) => {
  res.send(`id = ${req.params.id}; count = ${req.params.count}`);
});

app.get("/items", (req, res, next) => {
  res.send(`name = ${req.query.name}; count = ${req.query.count}`);
});

app.listen(8080);
console.log("listening");

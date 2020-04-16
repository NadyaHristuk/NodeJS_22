const express = require("express");

const app = express();

app.use(express.json());
app.use(express.urlencoded());

app.get("/", (req, res) => {
  res.send("Hello");
});

app.use(express.static("public"));

app.get("/product", (req, res) => {
  res.send("Hello from server");
});
app.post("/product", (req, res) => {
  res.send("Hello from server");
});
app.put("/product", (req, res) => {
  res.send("Hello from server");
});
app.delete("/product", (req, res) => {
  res.send("Hello from server");
});

app.get("/user", (req, res) => {
  res.send("user get");
});

app.post("/user", (req, res) => {
  console.log(req.body);

  res.send(req.body.login + " name " + req.body.password + " pass");
});

app.post(
  "/user/:id",
  (req, res, next) => {
    res.set("Set-Cookie", "www=sdfsdf");

    const err = new Error();
    err.status = 400;
    next(err);
  },
  (req, res) => {
    console.log(req.body);
    console.log(req.params);
    res.send(req.body.name + " name " + req.body.pass + " pass");
  }
);

app.listen(3002, () => {
  console.log("Server is runnig on port", 3002);
});

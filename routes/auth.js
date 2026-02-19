const express = require("express");
const fs = require("fs");
const router = express.Router();

router.get("/", (req, res) => res.render("login"));

router.post("/login", (req, res) => {
  const { username, password } = req.body;
  const users = JSON.parse(fs.readFileSync("users.json"));

  const user = users.find(u => u.username === username && u.password === password);
  if (!user) return res.send("Invalid credentials");

  req.session.user = user;
  res.redirect("/home");
});

router.get("/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/");
});

module.exports = function (req, res, next) {
  if (!req.session.user) {
    return res.redirect("/login");
  }
  next();
};

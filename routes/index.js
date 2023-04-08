const express = require("express");

const router = express.Router();

//middleware
const authCheck = require("../config/authCheck");

router.get("/", (req, res) => {
  res.render("home");
});

router.get("/dashboard", authCheck, (req, res) => {
  res.render("dash", { user: req.user });
});

module.exports = router;

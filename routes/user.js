const express = require("express");
const bcrypt = require("bcryptjs");
const passport = require("passport");

const router = express.Router();

const User = require("../models/userModel");

//middleware
const authCheck = require("../config/authCheck");
const authAlready = require("../config/authAlready");

router.get("/login", authAlready, (req, res) => {
  res.render("login");
});

router.get("/register", authAlready, (req, res) => {
  res.render("register");
});

router.post("/register", async (req, res) => {
  const { name, email, password, password2 } = req.body;

  let errors = [];

  if (!name || !email || !password || !password2) {
    errors.push({ msg: "Pleas enter all fields" });
  }

  if (password !== password2) {
    errors.push({ msg: "Passwords do not match" });
  }

  if (password.length < 6) {
    errors.push({ msg: "Password must be over 6 characters" });
  }

  if (errors.length > 0) {
    res.render("register", { errors, name, email });
  } else {
    const exist = await User.findOne({ email });

    if (exist) {
      errors.push({ msg: "This email is already exist" });
      return res.render("register", { errors, name, email });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({ name, email, password: hashedPassword });
    req.flash("successMsg", "You have registered successfully");
    res.redirect("/users/login");
  }
});

router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/dashboard",
    failureRedirect: "/users/login",
    failureFlash: true,
  })
);

router.get("/logout", authCheck, (req, res) => {
  req.logout((err) => {
    if (err) {
      console.log(err);
    } else {
      req.flash("successMsg", "You are logged out");
      res.redirect("/users/login");
    }
  });
});

module.exports = router;

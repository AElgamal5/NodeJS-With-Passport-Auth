const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const mongoose = require("mongoose");
const flash = require("connect-flash");
const session = require("express-session");
const passport = require("passport");

const app = express();

// Passport Config
require("./config/passport")(passport);

//DB connection
const DB_URI = require("./config/keys").MongoURI;

mongoose
  .connect(DB_URI)
  .then(() => console.log("MongoDB tmam..."))
  .catch((err) => console.log(err));

//EJS
app.set("view engine", "ejs");
app.use(expressLayouts);

//body parser
app.use(express.urlencoded({ extended: false }));

// Express session & Connect flash
app.use(
  session({
    secret: "secret",
    resave: true,
    saveUninitialized: true,
  })
);
app.use(flash());

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

//global vars
app.use((req, res, next) => {
  res.locals.successMsg = req.flash("successMsg");
  res.locals.errorMsg = req.flash("errorMsg");
  res.locals.error = req.flash("error");
  next();
});

//routes
app.use("/", require("./routes/index"));
app.use("/users", require("./routes/user"));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server run in port ${PORT}`);
});

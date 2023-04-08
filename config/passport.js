const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcryptjs");

// Load User model
const User = require("../models/userModel");

module.exports = function (passport) {
  passport.use(
    new LocalStrategy(
      {
        usernameField: "email",
        passwordField: "password",
      },
      async (email, password, done) => {
        try {
          // Look up user by email address
          const user = await User.findOne({ email });

          // If user not found, return error message
          if (!user) {
            return done(null, false, {
              message: "Incorrect email or password.",
            });
          }

          // If password doesn't match, return error message
          const match = await bcrypt.compare(password, user.password);
          if (!match) {
            return done(null, false, {
              message: "Incorrect email or password.",
            });
          }

          // If successful, return the user object
          return done(null, user);
        } catch (err) {
          return done(err);
        }
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user._id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id);
      done(null, user);
    } catch (err) {
      done(err);
    }
  });
};

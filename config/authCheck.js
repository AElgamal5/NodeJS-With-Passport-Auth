const authCheck = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  req.flash("errorMsg", "Please login first");
  res.redirect("/users/login");
};

module.exports = authCheck;

const authAlready = (req, res, next) => {
  if (req.isAuthenticated()) {
    req.flash("successMsg", "You are already logged in");
    res.redirect("/dashboard");
  }
  return next();
};

module.exports = authAlready;

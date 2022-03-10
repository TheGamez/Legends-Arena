
/* FUNCTIONS */

const isAuthenticated = (req, res, next) => {
  const isAuthenticated = req.session && req.session.user;

  if (!isAuthenticated) return res.json({ isAuthenticated: false });

  next();
}

module.exports = {
  isAuthenticated,
};
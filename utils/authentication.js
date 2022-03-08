
/* FUNCTIONS */

const isAuthenticated = (req, res, next) => {
  const isAuthenticated = req.session && req.session.user;

  if (!isAuthenticated) return res.json({ message: 'Unauthorized. Need to be authenticated.' });

  next();
}

module.exports = {
  isAuthenticated,
};
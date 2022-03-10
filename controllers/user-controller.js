
/* FUNCTIONS */

const authenticateUser = (req, res) => {
  res.json({ isAuthenticated: true });
}

const user404NotFound = (req, res) => {
  console.log('404 Not Found');
}

module.exports = {
  authenticateUser,
  user404NotFound,
};
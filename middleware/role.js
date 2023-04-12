
function checkPermissions(allowedPermissions, roleKey = 'role') {
    return (req, res, next) => {
      const userRole = req.query[roleKey];
      if (!allowedPermissions.includes(userRole)) {
        return res.status(403).json({ message: 'Forbidden' });
      }
      next();
    };
  }

  module.exports = {checkPermissions}
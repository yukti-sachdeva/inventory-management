const jwt = require('jsonwebtoken')
const { SECRET } = require('../config/setup')
//const User = require('../schema/users')

function checkPermissions(allowedPermissions) {
    return (req, res, next) => {
      let headerToken = req.headers['authorization']
      headerToken = headerToken.split(' ')[1];
      const info = jwt.decode(headerToken, SECRET)
      const userRole = info.role;
      if (!allowedPermissions.includes(userRole)) {
        return res.status(403).json({ message: 'Forbidden' });
      }
      next();
    };
  }

  module.exports = {checkPermissions}
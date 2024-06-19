const jwt = require('jsonwebtoken');
const { Admin, Teacher, Student } = require('../models');

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      let user = await Admin.findByPk(decoded.id);
      if (!user) {
        user = await Teacher.findByPk(decoded.id);
      }
      if (!user) {
        user = await Student.findByPk(decoded.id);
      }

      if (!user) {
        return res.status(401).json({ message: 'Not authorized' });
      }

      req.user = user;
      next();
    } catch (error) {
      return res.status(401).json({ message: 'Not authorized' });
    }
  } else {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }
};

module.exports = { protect };

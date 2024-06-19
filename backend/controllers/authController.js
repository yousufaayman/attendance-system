const { Admin, Teacher, Student } = require('../models');
const jwt = require('jsonwebtoken');

const login = async (req, res) => {
  const { email, password } = req.body;

  let user;
  let role;

  user = await Admin.findOne({ where: { email, password } });
  if (user) {
    role = 'admin';
  }

  if (!user) {
    user = await Teacher.findOne({ where: { email, password } });
    if (user) {
      role = 'teacher';
    }
  }

  if (!user) {
    user = await Student.findOne({ where: { email, password } });
    if (user) {
      role = 'student';
    }
  }

  if (!user) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }

  const token = jwt.sign({ id: user.id, role: user instanceof Admin ? 'admin' : user instanceof Teacher ? 'teacher' : 'student' }, process.env.JWT_SECRET, { expiresIn: '1h' });

  res.json({ token, role: user instanceof Admin ? 'admin' : user instanceof Teacher ? 'teacher' : 'student' });
};

module.exports = {
  login,
};

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const db = require('./models');
const authRoutes = require('./routes/authRoutes');
const dataRoutes = require('./routes/dataRoutes');
const teacherRoutes = require('./routes/teacherRoutes');
const studentRoutes = require('./routes/studentRoutes');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/data', dataRoutes); 
app.use('/api/teacher', teacherRoutes);
app.use('/api/student', studentRoutes);

db.sequelize.sync().then(() => {
  console.log("Database synchronized");
}).catch(err => {
  console.error("Error synchronizing database: ", err);
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

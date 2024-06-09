const express = require('express');
const app = express();
const db = require('./models');

db.sequelize.sync().then(() => {
  console.log("Database synchronized");
}).catch(err => {
  console.error("Error synchronizing database: ", err);
});

app.listen(4000, () => {
  console.log('Server is running on port 4000');
});

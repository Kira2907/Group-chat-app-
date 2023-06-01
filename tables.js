const Sequelize = require("sequelize");
const sequelize = require('../util/database');

const User = sequelize.define('user', {
  name: {
    type: Sequelize.STRING,
    allowNull: false
  },
  email: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true
  },
  phone: {
    type: Sequelize.STRING,
    allowNull: false
  },
  password: {
    type: Sequelize.STRING,
    allowNull: false
  },
 });

async function syncDatabase() {
  try {
    await sequelize.sync();
  } catch (error) {
    console.log(error);
  }
}

syncDatabase();

module.exports = User; 
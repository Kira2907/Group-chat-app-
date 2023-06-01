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

 const Message = sequelize.define('Message', {
   content: {
     type: Sequelize.STRING,
     allowNull: false,
   },
 });
 
 Message.belongsTo(User);
 User.hasMany(Message);
 
async function syncDatabase() {
  try {
    await sequelize.sync();
  } catch (error) {
    console.log(error);
  }
}

syncDatabase();

module.exports = {
  User,
  Message
}; 
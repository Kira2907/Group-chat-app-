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

const Message = sequelize.define('message', {
  content: {
    type: Sequelize.STRING,
    allowNull: false,
  },
});

// Relationship between User and Message
User.hasMany(Message);
Message.belongsTo(User);

const Group = sequelize.define('group', {
  name: {
    type: Sequelize.STRING,
    allowNull: false
  },
 });

// Relationships between User, Group, and Message (if needed)
User.belongsToMany(Group, { through: 'UserGroup' });
Group.belongsToMany(User, { through: 'UserGroup' });

Group.hasMany(Message);
Message.belongsTo(Group);

async function syncDatabase() {
  try {
    await sequelize.sync();
    console.log('Database synchronized successfully.');
  } catch (error) {
    console.log('Error synchronizing database:', error);
  }
}

syncDatabase();

module.exports = {
  User,
  Message,
  Group
};
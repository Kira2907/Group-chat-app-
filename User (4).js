const bcrypt = require('bcrypt');
const User = require('../Models/tables');

exports.signup =  async (req, res) => {
    const { name, email, phone, password } = req.body;
  
    try {
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        return res.status(400).json({ message: 'User already exists' });
      }
  
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);
  
      await User.create({ name, email, phone, password: hashedPassword });
  
      return res.status(200).json({ message: 'Signup successful' });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  };
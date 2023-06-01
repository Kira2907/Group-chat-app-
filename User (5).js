const bcrypt = require('bcrypt');
const User = require('../Models/tables');
const jwt = require('jsonwebtoken');

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

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.json({ message: 'User not found' });
    }

    const passwordMatches = await bcrypt.compare(password, user.password);
    if (!passwordMatches) {
      return res.json({ message: 'User not authorized' });
    }

    const token = jwt.sign({ id: user.id }, 'your_secret_key');

    return res.status(200).json({ token });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};  
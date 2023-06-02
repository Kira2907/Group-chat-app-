const jwt = require('jsonwebtoken');
const { User, Message } = require('../Models/tables');

exports.authenticateToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader;  
  console.log(token);

  if (token == null) {
    return res.sendStatus(401); // Unauthorized if token is missing
  }

  jwt.verify(token, 'secret', (err, user) => {
    if (err) {
      console.log(err);
      return res.sendStatus(403); // Forbidden if token is invalid
    }

    req.user = user; // Store the user object in the request
    next();
  });
};

exports.getAllMessages = async (req, res) => {
  try {
    const { excludeRecent } = req.query;

    let messages;
    if (excludeRecent) {
      const recentMessagesCount = 10;
      messages = await Message.findAll({
        order: [['createdAt', 'DESC']],
        offset: recentMessagesCount,
      });
    } else {
      messages = await Message.findAll();
    }

    return res.status(200).json(messages);
  } catch (error) {
    console.error(error);
    return res.sendStatus(500); // Internal server error
  }
}; 

exports.addMessage = async (req, res) => {
  const { content } = req.body;
  const userId = req.user.id;
  try {
    // Find the user who sent the message
    const user = await User.findByPk(userId);
    
    if (!user) {
      return res.sendStatus(404); // User not found
    }

    // Create a new message and associate it with the user
    const message = await Message.create({ content });
    await message.setUser(user);

    return res.status(201).json({name: user.name});  
  } catch (error) {
    console.error(error);
    return res.sendStatus(500); // Internal server error
  }
}; 
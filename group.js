const jwt = require('jsonwebtoken');
const { User, Message } = require('../Models/table');

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

exports.createGroup = async (req, res) => {
  const { name } = req.body;
  const { userId } = req.user;

  try {
    const group = await Group.create({
      name,
      userId,
    });

    await group.addUser(userId);

    return res.status(201).json(group);
  } catch (error) {
    console.error(error);
    return res.sendStatus(500); // Internal server error
  }
};

exports.getUserGroups = async (req, res) => {
  const { userId } = req.user;

  try {
    const user = await User.findByPk(userId, {
      include: {
        model: Group,
        attributes: ['id', 'name'],
        through: {
          attributes: [],
        },
      },
    });

    return res.status(200).json(user.groups);
  } catch (error) {
    console.error(error);
    return res.sendStatus(500); // Internal server error
  }
};

exports.getGroupMessages = async (req, res) => {
  const { groupId } = req.params;

  try {
    const group = await Group.findByPk(groupId);

    if (!group) {
      return res.sendStatus(404); // Group not found
    }

    const messages = await Message.findAll({
      where: {
        group_id: groupId,
      },
      include: {
        model: User,
        attributes: ['name'],
      },
    });

    return res.status(200).json(messages);
  } catch (error) {
    console.error(error);
    return res.sendStatus(500); // Internal server error
  }
};

exports.sendMessage = async (req, res) => {
  const { groupId } = req.params;
  const { content } = req.body;
  const userId = req.user.id;

  try {
    // Find the group
    const group = await Group.findByPk(groupId);

    if (!group) {
      return res.sendStatus(404); // Group not found
    }

    // Find the user who sent the message
    const user = await User.findByPk(userId);

    if (!user) {
      return res.sendStatus(404); // User not found
    }

    // Create a new message and associate it with the group and user
    const message = await Message.create({ content });
    await message.setGroup(group);
    await message.setUser(user);

    return res.status(201).json({ name: user.name });
  } catch (error) {
    console.error(error);
    return res.sendStatus(500); // Internal server error
  }
}; 
const { User, Group, GroupMember } = require('../Models/table');

exports.joinGroup = async (req, res) => {
  const { groupId, userId } = req.body;
  
  try {
    const group = await Group.findByPk(groupId);
    if (!group) {
      return res.status(404).json({ error: 'Group not found' });
    }

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    await GroupMember.create({
      groupId: group.id,
      userId: user.id,
      isAdmin: false,
    });

    return res.status(200).json({ message: 'User joined the group' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

exports.makeAdmin = async (req, res) => {
  const { groupId, userId } = req.body;

  try {
    const group = await Group.findByPk(groupId);
    if (!group) {
      return res.status(404).json({ error: 'Group not found' });
    }

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    await GroupMember.update(
      { isAdmin: true },
      { where: { groupId: group.id, userId: user.id } }
    );

    return res.status(200).json({ message: 'User is now an admin' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

exports.removeMember = async (req, res) => {
  const { groupId, userId } = req.body;

  try {
    const group = await Group.findByPk(groupId);
    if (!group) {
      return res.status(404).json({ error: 'Group not found' });
    }

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    await GroupMember.destroy({ where: { groupId: group.id, userId: user.id } });

    return res.status(200).json({ message: 'User removed from the group' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}; 
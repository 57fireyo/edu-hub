const express = require('express');
const router = express.Router();

let chatGroupsDb = [];
let groupMessagesDb = {};

// GET /api/chat/groups
router.get('/groups', (req, res) => {
  return res.json({ success: true, data: chatGroupsDb });
});

// POST /api/chat/groups
router.post('/groups', (req, res) => {
  const { name, description, category, avatarColor, isPrivate, creatorId, creatorName } = req.body;

  if (!name) {
    return res.status(400).json({ success: false, message: 'Group name is required' });
  }

  const newGroup = {
    id: `grp-${Date.now()}`,
    name,
    description: description || '',
    category: category || 'Project Collaboration',
    avatarColor: avatarColor || 'from-emerald-500 to-teal-700',
    creatorId: creatorId || 'student-member',
    creatorName: creatorName || 'Student',
    isPrivate: Boolean(isPrivate),
    createdAt: new Date().toISOString().split('T')[0],
    adminIds: [creatorId || 'student-member'],
    members: [
      {
        userId: creatorId || 'student-member',
        name: creatorName || 'Student',
        avatar: '',
        role: 'admin',
        joinedAt: new Date().toISOString().split('T')[0],
      },
    ],
  };

  chatGroupsDb.unshift(newGroup);
  groupMessagesDb[newGroup.id] = [];

  return res.status(201).json({ success: true, data: newGroup });
});

// GET /api/chat/groups/:groupId/messages
router.get('/groups/:groupId/messages', (req, res) => {
  const messages = groupMessagesDb[req.params.groupId] || [];
  return res.json({ success: true, count: messages.length, data: messages });
});

// POST /api/chat/groups/:groupId/messages
router.post('/groups/:groupId/messages', (req, res) => {
  const { groupId } = req.params;
  const { senderId, senderName, senderAvatar, senderRole, text, codeSnippet, replyTo } = req.body;

  if (!text && !codeSnippet) {
    return res.status(400).json({ success: false, message: 'Message text or code snippet is required' });
  }

  const now = new Date();
  const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const newMessage = {
    id: `gmsg-${Date.now()}`,
    groupId,
    senderId: senderId || 'student-member',
    senderName: senderName || 'Member',
    senderAvatar: senderAvatar || '',
    senderRole: senderRole || 'member',
    text: text || '',
    codeSnippet: codeSnippet || undefined,
    replyTo: replyTo || undefined,
    timestamp: timeStr,
    createdAt: Date.now(),
    reactions: {},
  };

  if (!groupMessagesDb[groupId]) {
    groupMessagesDb[groupId] = [];
  }

  groupMessagesDb[groupId].push(newMessage);

  return res.status(201).json({ success: true, data: newMessage });
});

module.exports = router;

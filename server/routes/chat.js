const express = require('express');
const router = express.Router();

let chatGroupsDb = [
  {
    id: 'grp-major-project-2026',
    name: 'Major Project Team 2026',
    description: 'WhatsApp-style group for team coordination, code reviews, and project milestones',
    category: 'Project Collaboration',
    avatarColor: 'from-emerald-500 to-teal-700',
    creatorId: 'user-101',
    creatorName: 'Aarav Sharma',
    isPrivate: false,
    createdAt: '2026-08-10',
    adminIds: ['user-101'],
    members: [
      {
        userId: 'user-101',
        name: 'Aarav Sharma',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200',
        role: 'admin',
        joinedAt: '2026-08-10',
      },
      {
        userId: 'user-102',
        name: 'Priya Patel',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200',
        role: 'member',
        joinedAt: '2026-08-11',
      },
      {
        userId: 'user-103',
        name: 'Rohan Gupta',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200',
        role: 'member',
        joinedAt: '2026-08-12',
      },
    ],
  },
  {
    id: 'grp-hackathon-alpha',
    name: 'Campus Hackathon 2026 Squad',
    description: 'Sprint planning, idea brainstorming, and fast prototyping for the Inter-College Hackathon',
    category: 'Hackathon Team',
    avatarColor: 'from-indigo-600 to-purple-600',
    creatorId: 'user-102',
    creatorName: 'Priya Patel',
    isPrivate: false,
    createdAt: '2026-08-15',
    adminIds: ['user-102'],
    members: [
      {
        userId: 'user-101',
        name: 'Aarav Sharma',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200',
        role: 'member',
        joinedAt: '2026-08-15',
      },
      {
        userId: 'user-102',
        name: 'Priya Patel',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200',
        role: 'admin',
        joinedAt: '2026-08-15',
      },
    ],
  },
];

let groupMessagesDb = {
  'grp-major-project-2026': [
    {
      id: 'gmsg-1',
      groupId: 'grp-major-project-2026',
      senderId: 'user-101',
      senderName: 'Aarav Sharma',
      senderAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200',
      senderRole: 'admin',
      text: 'Hey team! Welcome to our official project group. I added the Node.js backend server structure and live Firestore integration.',
      timestamp: '10:15 AM',
      createdAt: 1723200000000,
      reactions: { '🔥': ['user-102', 'user-103'], '🚀': ['user-101'] },
    },
    {
      id: 'gmsg-2',
      groupId: 'grp-major-project-2026',
      senderId: 'user-102',
      senderName: 'Priya Patel',
      senderAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200',
      senderRole: 'member',
      text: 'Awesome! Can you share the Socket.IO event handler for syncing the chat messages in real time?',
      timestamp: '10:18 AM',
      createdAt: 1723200180000,
      reactions: { '👍': ['user-101'] },
    },
  ],
};

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
    creatorId: creatorId || 'user-101',
    creatorName: creatorName || 'Aarav Sharma',
    isPrivate: Boolean(isPrivate),
    createdAt: new Date().toISOString().split('T')[0],
    adminIds: [creatorId || 'user-101'],
    members: [
      {
        userId: creatorId || 'user-101',
        name: creatorName || 'Aarav Sharma',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200',
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
    senderId: senderId || 'user-101',
    senderName: senderName || 'Aarav Sharma',
    senderAvatar: senderAvatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200',
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

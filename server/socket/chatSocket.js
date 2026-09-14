/**
 * Socket.IO Handler for EduHub Real-Time WhatsApp-Style Group Chats
 */

function setupChatSocket(io) {
  // Store connected users & active rooms
  const onlineUsers = new Map(); // socket.id -> { userId, userName }
  const roomTypingUsers = new Map(); // roomId -> Set of userNames

  io.on('connection', (socket) => {
    console.log(`[Socket.IO] New client connected: ${socket.id}`);

    // 1. User Online Registration
    socket.on('user_connected', (userData) => {
      if (userData && userData.userId) {
        onlineUsers.set(socket.id, {
          userId: userData.userId,
          name: userData.name,
          role: userData.role,
        });
        io.emit('online_users_count', onlineUsers.size);
      }
    });

    // 2. Join WhatsApp Group Room
    socket.on('join_group', ({ groupId, userName }) => {
      socket.join(groupId);
      console.log(`[Socket.IO] User ${userName} (${socket.id}) joined room: ${groupId}`);
      
      // Notify group members
      socket.to(groupId).emit('user_joined_group', {
        groupId,
        userName,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      });
    });

    // 3. Leave Group Room
    socket.on('leave_group', ({ groupId, userName }) => {
      socket.leave(groupId);
      console.log(`[Socket.IO] User ${userName} left room: ${groupId}`);
      socket.to(groupId).emit('user_left_group', { groupId, userName });
    });

    // 4. Send Message (with code snippet, quoted reply, timestamp)
    socket.on('send_group_message', (messageData) => {
      const { groupId, text, codeSnippet, senderName, senderId, senderAvatar, senderRole, replyTo } = messageData;

      const formattedMessage = {
        id: `gmsg-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        groupId,
        senderId,
        senderName,
        senderAvatar,
        senderRole,
        text,
        codeSnippet,
        replyTo,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        createdAt: Date.now(),
        reactions: {},
      };

      // Broadcast to all participants in this group (including sender)
      io.to(groupId).emit('new_group_message', formattedMessage);
    });

    // 5. Typing Indicators
    socket.on('typing_start', ({ groupId, userName }) => {
      socket.to(groupId).emit('user_typing', { groupId, userName, isTyping: true });
    });

    socket.on('typing_stop', ({ groupId, userName }) => {
      socket.to(groupId).emit('user_typing', { groupId, userName, isTyping: false });
    });

    // 6. Live Emoji Reactions (👍, ❤️, 🔥, 🚀, 💡, 🎉)
    socket.on('react_message', ({ groupId, messageId, emoji, userId }) => {
      io.to(groupId).emit('message_reaction_updated', {
        groupId,
        messageId,
        emoji,
        userId,
      });
    });

    // 7. Message Deletion
    socket.on('delete_message', ({ groupId, messageId }) => {
      io.to(groupId).emit('message_deleted', {
        groupId,
        messageId,
      });
    });

    // 8. Disconnect
    socket.on('disconnect', () => {
      const user = onlineUsers.get(socket.id);
      if (user) {
        console.log(`[Socket.IO] User disconnected: ${user.name} (${socket.id})`);
        onlineUsers.delete(socket.id);
        io.emit('online_users_count', onlineUsers.size);
      }
    });
  });
}

module.exports = { setupChatSocket };

import ChatMessage from '../models/ChatMessage.js';

// @desc    Get chat messages (General channel or Direct Messages with another user)
// @route   GET /api/chats
// @access  Private
const getChatMessages = async (req, res) => {
  try {
    const { recipient } = req.query;
    let query = {};

    if (recipient) {
      // Direct message history between req.user._id and recipient
      query = {
        $or: [
          { sender: req.user._id, receiver: recipient },
          { sender: recipient, receiver: req.user._id },
        ],
      };
    } else {
      // General channel chat history
      query = { receiver: null };
    }

    const messages = await ChatMessage.find(query)
      .populate('sender', 'name role')
      .populate('receiver', 'name role')
      .sort({ createdAt: 1 })
      .limit(100); // limit to last 100 messages for speed

    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Server error' });
  }
};

// @desc    Send a chat message
// @route   POST /api/chats
// @access  Private
const sendChatMessage = async (req, res) => {
  try {
    const { text, receiver } = req.body;

    if (!text) {
      return res.status(400).json({ message: 'Message text is required' });
    }

    const message = new ChatMessage({
      sender: req.user._id,
      receiver: receiver || null,
      text,
    });

    const savedMessage = await message.save();
    const populated = await ChatMessage.findById(savedMessage._id)
      .populate('sender', 'name role')
      .populate('receiver', 'name role');

    res.status(201).json(populated);
  } catch (error) {
    res.status(400).json({ message: error.message || 'Failed to send message' });
  }
};

export { getChatMessages, sendChatMessage };

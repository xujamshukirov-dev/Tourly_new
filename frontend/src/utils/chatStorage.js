const CHATS_KEY = 'tourly_chat_messages';

function readAllChats() {
  try {
    const raw = localStorage.getItem(CHATS_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function writeAllChats(chats) {
  try {
    localStorage.setItem(CHATS_KEY, JSON.stringify(chats));
  } catch (e) {
    console.error('Failed to save chats', e);
  }
}

/**
 * Returns messages for a specific conversation ID.
 * If empty, seeds with a friendly initial message from the provider.
 */
export function getChatMessages(chatId, providerInfo = {}) {
  const all = readAllChats();
  if (all[chatId] && all[chatId].length > 0) {
    return all[chatId];
  }

  // Initial welcome message from the provider/driver
  const providerName = providerInfo.name || 'Haydovchi';
  const welcomeText = providerInfo.serviceType === 'taxi'
    ? `Assalomu alaykum! Men ${providerName}. Qayerga bormoqchisiz? Sizga qulay vaqt va manzilni yozib qoldiring.`
    : `Assalomu alaykum! Men ${providerName}. Xizmatimiz bo'yicha savollaringiz bo'lsa bemalol yozishingiz mumkin.`;

  const initialMsgs = [
    {
      id: Date.now() - 60000,
      senderId: providerInfo.id || 'provider',
      senderName: providerName,
      text: welcomeText,
      time: 'Yangi',
      isProvider: true,
    },
  ];
  all[chatId] = initialMsgs;
  writeAllChats(all);
  return initialMsgs;
}

/**
 * Send a message into the chat.
 */
export function sendChatMessage(chatId, message) {
  const all = readAllChats();
  const list = all[chatId] || [];
  const newMsg = {
    id: Date.now(),
    ...message,
    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  };
  all[chatId] = [...list, newMsg];
  writeAllChats(all);
  return newMsg;
}

/**
 * List all active conversations
 */
export function getAllConversations() {
  const all = readAllChats();
  return Object.keys(all).map((chatId) => {
    const msgs = all[chatId] || [];
    const lastMsg = msgs[msgs.length - 1];
    return {
      chatId,
      lastMessage: lastMsg?.text || '',
      lastTime: lastMsg?.time || '',
      count: msgs.length,
    };
  });
}

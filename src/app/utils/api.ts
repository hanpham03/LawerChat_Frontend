const API_BASE_URL = "http://localhost:3001/api";

export async function getChatSessions(userId: number, token: string) {
  const res = await fetch(`${API_BASE_URL}/chat-sessions/user/${userId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.ok ? res.json() : [];
}

export async function getMessages(sessionId: number, token: string) {
  const res = await fetch(`${API_BASE_URL}/messages/session/${sessionId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.ok ? res.json() : [];
}

export async function startNewChatSession(userId: number, token: string) {
  const res = await fetch(`${API_BASE_URL}/chat-sessions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ user_id: userId, chatbot_id: 1 }),
  });
  const data = await res.json();
  return res.ok ? data.sessionId : null;
}

export async function sendMessageToAPI(
  sessionId: number,
  text: string,
  token: string,
  role: "user" | "assistant" // 🆕 Thêm tham số role
) {
  await fetch(`${API_BASE_URL}/messages`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      session_id: sessionId,
      content: text,
      role: role, // 🆕 Truyền role vào body
    }),
  });

  // Nếu là tin nhắn từ user, gọi API chatbot
  if (role === "user") {
    const difyToken = localStorage.getItem("dify_token");
    if (!difyToken) return null;

    const res = await fetch(`${API_BASE_URL}/chatbots/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${difyToken}`,
      },
      body: JSON.stringify({ query: text }),
    });

    const data = await res.json();
    return data?.answer ?? null;
  }
  return null; // Nếu là assistant, chỉ cần lưu vào DB, không cần gọi API chatbot
}

export async function deleteChatSessionAPI(sessionId: number, token: string) {
  const res = await fetch(`${API_BASE_URL}/chat-sessions/${sessionId}`, {
    method: "DELETE",
  });
  console.log("deleteChatSessionAPI", res);
  const data = await res.json();
  return res.ok ? data.sessionId : null;
}

const API_BASE_URL = "http://localhost:3001/api";

export async function getChatSessions(
  userId: number,
  token: string,
  chatbotId?: number
) {
  let url = `${API_BASE_URL}/chat-sessions/user/${userId}`;

  if (chatbotId) {
    url = `${API_BASE_URL}/chat-sessions/chatbot/${chatbotId}`; // 🔹 API chỉ lấy phiên chat của chatbot
  }

  const res = await fetch(url, {
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

export async function startNewChatSession(
  userId: number,
  token: string,
  chatbotId: number
) {
  const res = await fetch(`${API_BASE_URL}/chat-sessions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ user_id: userId, chatbot_id: chatbotId }),
  });
  const data = await res.json();
  return res.ok ? data.sessionId : null;
}

export async function sendMessageToAPI(
  sessionId: number,
  text: string,
  token: string,
  role: "user" | "assistant",
  dify_chatbot_id?: string
) {
  console.log(sessionId, text, token, role);
  await fetch(`${API_BASE_URL}/messages`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      session_id: sessionId,
      content: text,
      role: role,
    }),
  });

  if (role === "user") {
    const difyToken = localStorage.getItem("dify_token");
    if (!difyToken) {
      console.warn("⚠ Không tìm thấy token của Dify!");
      return null;
    }

    const requestBody: Record<string, any> = { query: text };
    if (dify_chatbot_id) {
      requestBody.dify_chatbot_id = dify_chatbot_id;
    }

    console.log(
      "📤 Request gửi đến Dify:",
      JSON.stringify(requestBody, null, 2)
    );

    try {
      const res = await fetch(`${API_BASE_URL}/chatbots/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${difyToken}`,
        },
        body: JSON.stringify(requestBody),
      });

      if (!res.ok) {
        console.error("❌ Lỗi API:", res.status, await res.text());
        return null;
      }

      const data = await res.json();
      console.log("🔍 API Response:", JSON.stringify(data, null, 2));

      return data?.answer?.trim() || null;
    } catch (error) {
      console.error("❌ Lỗi khi gọi API Dify:", error);
      return null;
    }
  }

  return null;
}

export async function deleteChatSessionAPI(sessionId: number, token: string) {
  const res = await fetch(`${API_BASE_URL}/chat-sessions/${sessionId}`, {
    method: "DELETE",
  });
  const data = await res.json();
  return res.ok ? data.sessionId : null;
}

export async function getChatbotsInfor(token: string, id: int) {
  const res = await fetch(`${API_BASE_URL}/chatbots/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    method: "GET",
  });
  return res.ok ? res.json() : [];
}

export async function getSessionByChatbotId(chatbotId: number, token: string) {
  try {
    const response = await fetch(
      `http://localhost:3001/api/chat-sessions/chatbot/${chatbotId}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    if (!response.ok) throw new Error("⚠️ Failed to fetch chat sessions");

    const sessions = await response.json();
    return sessions; // ✅ Trả về danh sách phiên chat
  } catch (error) {
    console.error("🚨 Lỗi khi lấy phiên chat:", error);
    return []; // ✅ Nếu lỗi, trả về mảng rỗng
  }
}

export async function deleteChatbotUser(
  chatbotId: number,
  dify_chatbot_id: string,
  dify_token: string
) {
  try {
    const response = await fetch(
      `http://localhost:3001/api/chatbots/${chatbotId}`, // Chỉ truyền chatbotId vào URL
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${dify_token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ dify_chatbot_id }), // Truyền dify_chatbot_id qua body
      }
    );

    if (!response.ok) throw new Error("⚠️ Failed to delete chatbot");

    const del = await response.json();
    return del;
  } catch (error) {
    console.error("🚨 Lỗi khi xóa chatbot:", error);
  }
}

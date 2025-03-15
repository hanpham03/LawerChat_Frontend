"use client";

export async function handleChatbotTags(
  email: string,
  chatbotId: string,
  dify_token: string
) {
  try {
    // 1️⃣ Kiểm tra danh sách tags hiện tại
    const tagsResponse = await fetch(
      `http://localhost/console/api/tags?type=app`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${dify_token}`,
        },
      }
    );

    const tagsData = await tagsResponse.json();
    let existingTag = tagsData.find((tag: any) => tag.name === email);

    if (!existingTag) {
      console.log("Chưa có tag với email:", email);

      // 2️⃣ Nếu chưa có tag, tạo tag mới
      const createTagResponse = await fetch(
        `http://localhost/console/api/tags`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${dify_token}`,
          },
          body: JSON.stringify({
            name: email,
            type: "app",
          }),
        }
      );

      const createTagData = await createTagResponse.json();
      if (!createTagResponse.ok) {
        throw new Error("Không thể tạo tag mới.");
      }
      existingTag = createTagData;
    } else {
      console.log("Đã có tag với email:", email);
    }

    // 3️⃣ Gán chatbot vào tag
    const assignTagResponse = await fetch(
      `http://localhost/console/api/tag-bindings/create`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${dify_token}`,
        },
        body: JSON.stringify({
          tag_ids: [existingTag.id],
          target_id: chatbotId,
          type: "app",
        }),
      }
    );

    if (!assignTagResponse.ok) {
      throw new Error("Không thể gán chatbot vào tag.");
    }

    return `Tạo chatbot cho ${email} và gán vào tag thành công!`;
  } catch (error: any) {
    throw new Error(`Lỗi xử lý tag: ${error.message}`);
  }
}

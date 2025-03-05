export const loginDify = async () => {
  // Lấy thông tin đăng nhập từ biến môi trường
  const email = "hoaihanphamk123@gmail.com";
  const password = "Han089203018443";
  
  try {
    // Gửi yêu cầu POST để đăng nhập
    const difyResponse = await fetch("http://localhost/console/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    // Chuyển đổi phản hồi thành JSON
    const difyData = await difyResponse.json();

    // Nếu đăng nhập không thành công, ném lỗi
    if (!difyResponse.ok) {
      throw new Error(difyData.message || "Đăng nhập Dify thất bại");
    }
    
    const difyToken = difyData.data.access_token;
    localStorage.setItem("dify_token", difyToken);

    // tôi muốn lấy id từ access_token!!
  } catch (error) {
    console.error("Lỗi đăng nhập hoặc tạo chatbot:", error);
    throw error;
  }
};

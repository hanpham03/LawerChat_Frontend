// handle_logout.js

const handleLogout = async () => {
    try {
      // Gọi API backend để xóa cookie token
      const response = await fetch("http://localhost:3001/api/auth/logout", {
        method: "POST",
        credentials: "include", // Quan trọng: để gửi cookie kèm request
      });
  
      if (!response.ok) {
        throw new Error("Logout failed");
      }
  
      // Nếu cần, xóa thêm các item khác trong localStorage
      localStorage.removeItem("token");
      localStorage.removeItem("dify_token");
      localStorage.removeItem("chatbot_id");
      localStorage.removeItem("user");
  
      // Chuyển hướng người dùng về trang đăng nhập
      window.location.href = "/login";
    } catch (error) {
      console.error("Error logging out:", error);
      alert("Đăng xuất thất bại. Vui lòng thử lại.");
    }
  };
  
  module.exports = handleLogout;
  
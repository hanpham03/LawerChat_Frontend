import Link from "next/link";
import Image from "next/image";

const blogPage = () => {
  const featuredArticle = {
    title:
      "5 Công việc lặp đi lặp lại mà việc ứng dụng AI chatbot có thể xử lý hiệu quả",
    date: "12/11/2024",
    category: "Knowledge Base",
    image: "/assets/featured-blog.png",
    description:
      "Trong môi trường kinh doanh hiện đại, hiệu quả là yếu tố quan trọng hàng đầu. Tuy nhiên, những công việc chăm sóc khách hàng lặp đi lặp lại có thể làm giảm năng suất của nhân viên và ảnh hưởng đến chất lượng dịch vụ...",
    link: "/blog/ai-chatbot-xu-ly-hieu-qua",
  };

  const latestArticles = [
    {
      title:
        "AI phân tích dữ liệu: Công Cụ Tiềm Năng Để Doanh Nghiệp Việt Tăng Trưởng Bền Vững",
      date: "11/02/2025",
      category: "Lawer AI",
      image: "/assets/blog1.png",
      link: "/blog/ai-phan-tich-du-lieu",
    },
    {
      title:
        "Lawer AI: Ứng Dụng AI trong Doanh Nghiệp – Cách Mang Hóa Quản Lý và Vận Hành",
      date: "11/02/2025",
      category: "Lawer AI",
      image: "/assets/blog2.png",
      link: "/blog/Lawer-ai-trong-doanh-nghiep",
    },
    {
      title:
        "Phân tích dữ liệu - Tương lai của doanh nghiệp trong thế giới công nghệ AI",
      date: "11/02/2025",
      category: "Lawer AI",
      image: "/assets/blog3.png",
      link: "/blog/phan-tich-du-lieu-tuong-lai",
    },
  ];

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      {/* Title */}
      <h1 className="text-4xl font-bold text-green-700">Lawer Chatbot Blog</h1>
      <p className="text-gray-600 mt-3">
        Bước vào thế giới kiến thức AI chatbot tại trang blog chính thức của
        Lawer Chatbot! Chúng tôi sẽ phân tích mọi tin tức liên quan đến chatbot,
        từ kiến thức cơ bản đến AI hiện đại.
      </p>

      {/* Featured Article */}
      <div className="mt-8 p-6 bg-green-50 rounded-lg shadow-lg flex gap-6">
        <Image
          src={featuredArticle.image}
          alt="Featured"
          width={300} // Điều chỉnh theo thiết kế
          height={200} // Điều chỉnh theo thiết kế
          className="w-1/3 rounded-lg object-cover"
        />

        <div className="flex flex-col justify-between">
          <span className="text-green-600 font-semibold text-sm bg-green-200 px-3 py-1 rounded-md w-fit">
            {featuredArticle.category}
          </span>
          <h2 className="text-2xl font-bold text-gray-800">
            {featuredArticle.title}
          </h2>
          <p className="text-gray-600">{featuredArticle.description}</p>
          <Link
            href={featuredArticle.link}
            className="text-green-600 font-semibold mt-3"
          >
            Đọc thêm →
          </Link>
        </div>
      </div>

      {/* Latest Articles */}
      <h2 className="text-2xl font-bold text-gray-800 mt-10">
        Bài viết mới nhất
      </h2>
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {latestArticles.map((article, index) => (
          <div
            key={index}
            className="bg-white rounded-lg shadow-lg overflow-hidden"
          >
            <Image
              src={article.image}
              alt="Blog"
              width={400} // Điều chỉnh theo thiết kế
              height={250} // Điều chỉnh theo thiết kế
              className="w-full h-40 object-cover"
            />
            <div className="p-4">
              <span className="text-green-600 font-semibold text-sm bg-green-200 px-3 py-1 rounded-md w-fit">
                {article.category}
              </span>
              <h3 className="text-lg font-bold mt-2">{article.title}</h3>
              <p className="text-gray-500 text-sm">{article.date}</p>
              <Link
                href={article.link}
                className="text-green-600 font-semibold mt-2 inline-block"
              >
                Đọc thêm →
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default blogPage;

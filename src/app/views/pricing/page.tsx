import React from "react";

const PricingPage = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-6 flex flex-col items-center">
      <h1 className="text-4xl font-bold text-gray-800 mb-4">
        Chi phí phù hợp cho mọi doanh nghiệp
      </h1>
      <p className="text-lg text-gray-600 mb-8 text-center max-w-2xl">
        LawerChat có bảng giá linh hoạt theo nhu cầu bất kể doanh nghiệp bạn lớn
        hay nhỏ. Hãy chọn gói dịch vụ phù hợp hoặc liên hệ trực tiếp với chúng
        tôi!
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl">
        {/* Basic Plan */}
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-green-500">
          <h2 className="text-2xl font-bold text-green-600 mb-4">Cơ Bản</h2>
          <p className="text-gray-500 mb-4">Bao gồm:</p>
          <ul className="text-gray-700 space-y-2">
            <li>✅ 01 chatbot</li>
            <li>✅ 4.000 tin nhắn/tháng</li>
            <li>✅ Tối đa 200 URL huấn luyện</li>
          </ul>
          <button className="mt-6 w-full bg-green-500 text-white py-2 rounded-lg font-semibold hover:bg-green-600 transition">
            Liên Hệ
          </button>
        </div>

        {/* Advanced Plan */}
        <div className="bg-white p-6 rounded-2xl shadow-lg border-4 border-green-500">
          <h2 className="text-2xl font-bold text-green-600 mb-4">Nâng Cao</h2>
          <p className="text-gray-500 mb-4">Phổ biến nhất</p>
          <ul className="text-gray-700 space-y-2">
            <li>✅ 03 chatbot</li>
            <li>✅ 15.000 tin nhắn/tháng (cho tất cả bot)</li>
            <li>✅ Tối đa 1.000 URL huấn luyện</li>
          </ul>
          <button className="mt-6 w-full bg-green-500 text-white py-2 rounded-lg font-semibold hover:bg-green-600 transition">
            Liên Hệ
          </button>
        </div>

        {/* Custom Plan */}
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-green-500">
          <h2 className="text-2xl font-bold text-green-600 mb-4">Tùy Chỉnh</h2>
          <p className="text-gray-500 mb-4">Bao gồm:</p>
          <ul className="text-gray-700 space-y-2">
            <li>✅ Không giới hạn chatbot</li>
            <li>✅ Không giới hạn tin nhắn/tháng</li>
            <li>✅ Không giới hạn URL huấn luyện</li>
          </ul>
          <button className="mt-6 w-full bg-green-500 text-white py-2 rounded-lg font-semibold hover:bg-green-600 transition">
            Liên Hệ
          </button>
        </div>
      </div>
    </div>
  );
};

export default PricingPage;

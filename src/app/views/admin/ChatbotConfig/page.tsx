"use client";

import { useState, useCallback } from "react";

interface UploadedFile {
  id: number; // local UI id
  name: string; // file name
  docId: string; // Dify document id
}

export default function FileUploadOnly() {
  const [file, setFile] = useState<File | null>(null);
  const [dragging, setDragging] = useState<boolean>(false);
  const [uploading, setUploading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);

  const API_BASE =
    "http://localhost/v1/datasets/30498396-c05e-4895-9db4-7141bb25d280";
  const API_KEY = "dataset-p6xywA819ulO6Q2ugCT0CQ3A";

  const uploadFile = useCallback(async (fileToUpload: File) => {
    setUploading(true);
    setError(null);
    try {
      const formData = new FormData();
      const config = {
        indexing_technique: "high_quality",
        process_rule: {
          rules: {
            pre_processing_rules: [
              { id: "remove_extra_spaces", enabled: true },
              { id: "remove_urls_emails", enabled: true },
            ],
            segmentation: { separator: "###", max_tokens: 500 },
          },
          mode: "custom",
        },
      };
      formData.append("data", JSON.stringify(config));
      formData.append("file", fileToUpload);

      const response = await fetch(`${API_BASE}/document/create-by-file`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${API_KEY}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(`Upload failed: ${response.status} - ${text}`);
      }

      const result = await response.json();
      const docId = result.document?.id;
      if (!docId) {
        throw new Error("No document id returned from API");
      }

      // Thêm file vào danh sách khi upload thành công
      const newItem: UploadedFile = {
        id: Date.now(),
        name: fileToUpload.name,
        docId: docId,
      };
      setUploadedFiles((prev) => [...prev, newItem]);
      setFile(null);
    } catch (err: unknown) {
      // ✅ Fix: any → unknown
      console.error(err);
      setError(err instanceof Error ? err.message : "Unknown error occurred");
    } finally {
      setUploading(false);
    }
  }, []);

  const handleFileSelection = (selectedFile: File) => {
    setFile(selectedFile);
    setError(null);
  };

  const handleFileUploadClick = () => {
    if (file && !uploading) {
      uploadFile(file);
    }
  };

  const handleFileUploadInput = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (event.target.files && event.target.files.length > 0) {
      handleFileSelection(event.target.files[0]);
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragging(false);
    if (event.dataTransfer.files.length > 0) {
      handleFileSelection(event.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = () => {
    setDragging(false);
  };

  const handleDelete = async (uiId: number, docId: string) => {
    setError(null);
    try {
      const response = await fetch(`${API_BASE}/documents/${docId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${API_KEY}`,
        },
      });
      if (!response.ok) {
        const text = await response.text();
        throw new Error(`Delete failed: ${response.status} - ${text}`);
      }
      // Xóa khỏi UI khi thành công
      setUploadedFiles((prev) => prev.filter((item) => item.id !== uiId));
    } catch (err: unknown) {
      // ✅ Fix: any → unknown
      console.error(err);
      setError(err instanceof Error ? err.message : "Unknown error occurred");
    }
  };

  return (
    <div className="flex flex-col h-[600px] w-full bg-gray-100 p-4">
      <div
        className={`p-6 rounded-lg shadow-md flex flex-col items-center justify-center border-2 border-dashed ${
          dragging
            ? "border-blue-500 bg-blue-100"
            : "border-gray-300 bg-gray-50"
        }`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <h2 className="text-lg font-semibold mb-2">
          {uploading
            ? "Đang upload..."
            : file
            ? `📄 ${file.name}`
            : "📜 Kéo thả file hoặc nhấn để chọn"}
        </h2>
        <input
          type="file"
          className="hidden"
          id="fileUpload"
          onChange={handleFileUploadInput}
        />
        <label
          htmlFor="fileUpload"
          className={`cursor-pointer py-2 px-4 rounded-md hover:bg-blue-600 mb-2 ${
            uploading
              ? "bg-gray-400 text-gray-200 cursor-not-allowed"
              : file
              ? "bg-green-500 text-white"
              : "bg-blue-500 text-white"
          }`}
          onClick={(e) => {
            if (file) {
              e.preventDefault();
              handleFileUploadClick();
            }
          }}
        >
          {uploading ? "Đang upload..." : file ? "Upload" : "Chọn file"}
        </label>
        {error && <p className="mt-2 text-red-500">Lỗi: {error}</p>}
      </div>

      {/* Danh sách file đã upload */}
      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-2">Danh sách tài liệu</h3>
        {uploadedFiles.length === 0 ? (
          <p className="text-gray-500">Chưa có tài liệu nào.</p>
        ) : (
          <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
            <thead>
              <tr className="bg-gray-200">
                <th className="py-2 px-4 text-left">Tên file</th>
                <th className="py-2 px-4">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {uploadedFiles.map((item) => (
                <tr key={item.id} className="border-b last:border-b-0">
                  <td className="py-2 px-4">{item.name}</td>
                  <td className="py-2 px-4 text-center">
                    <button
                      className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                      onClick={() => handleDelete(item.id, item.docId)}
                    >
                      Xóa
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

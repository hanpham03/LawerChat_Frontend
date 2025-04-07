"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function UploadBlogPage() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Upload Blog
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-4">
            <div>
              <label
                htmlFor="title"
                className="block text-sm font-medium text-gray-700"
              >
                Tiêu đề
              </label>
              <Input
                id="title"
                type="text"
                placeholder="Nhập tiêu đề blog"
                className="mt-1"
              />
            </div>
            <div>
              <label
                htmlFor="content"
                className="block text-sm font-medium text-gray-700"
              >
                Nội dung
              </label>
              <Textarea
                id="content"
                placeholder="Nhập nội dung blog"
                className="mt-1"
                rows={6}
              />
            </div>
            <div>
              <label
                htmlFor="image"
                className="block text-sm font-medium text-gray-700"
              >
                Hình ảnh (tùy chọn)
              </label>
              <Input id="image" type="file" accept="image/*" className="mt-1" />
            </div>
            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            >
              Upload Blog
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

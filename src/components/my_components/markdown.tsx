<<<<<<< HEAD
import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface CustomMarkdownProps {
  children: string;
}

const CustomMarkdown: React.FC<CustomMarkdownProps> = ({ children }) => {
=======
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const CustomMarkdown = ({ children }) => {
>>>>>>> 8854e0c772d2ba22878b86a4d5517864963777dd
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
<<<<<<< HEAD
        h1: ({ ...props }) => (
          <h1
            className="text-2xl font-bold mb-3 mt-4 border-b pb-1 border-gray-200"
            {...props}
          />
        ),
        h2: ({ ...props }) => (
          <h2
            className="text-xl font-semibold mb-2 mt-3 border-b pb-1 border-gray-200"
            {...props}
          />
        ),
        h3: ({ ...props }) => (
          <h3 className="text-lg font-semibold mb-2 mt-2" {...props} />
        ),
        p: ({ ...props }) => <p className="mb-2 leading-relaxed" {...props} />,
        ul: ({ ...props }) => (
          <ul className="list-disc pl-5 mb-2 space-y-1" {...props} />
        ),
        ol: ({ ...props }) => (
          <ol className="list-decimal pl-5 mb-2 space-y-1" {...props} />
        ),
        li: ({ ...props }) => <li className="mb-1" {...props} />,
        code: ({ inline, className, children, ...props }: any) => {
          const match = /language-(\w+)/.exec(className || "");
          return !inline ? (
            <div className="relative group">
              <pre
                className={`bg-gray-800 p-3 rounded-md overflow-x-auto text-sm mb-2 ${
                  match ? `language-${match[1]}` : ""
                }`}
              >
                <code
                  className={`text-gray-100 ${
                    match ? `language-${match[1]}` : ""
                  }`}
                  {...props}
                >
                  {String(children).replace(/\n$/, "")}
                </code>
              </pre>
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  className="bg-gray-700 hover:bg-gray-600 text-xs px-2 py-1 rounded text-gray-200 transition-colors"
                  onClick={() => {
                    navigator.clipboard.writeText(String(children));
                  }}
                >
                  Copy
                </button>
              </div>
            </div>
          ) : (
            <code
              className="bg-gray-100 text-red-600 px-1.5 py-0.5 rounded text-sm font-mono"
              {...props}
            >
              {children}
            </code>
          );
        },
        blockquote: ({ ...props }) => (
          <blockquote
            className="border-l-4 border-gray-300 pl-4 py-1 italic mb-2 text-gray-600"
            {...props}
          />
        ),
        a: ({ ...props }) => (
          <a
            className="text-blue-600 hover:underline hover:text-blue-800 transition-colors"
=======
        h1: ({ node, ...props }) => (
          <h1
            className="text-2xl font-bold text-blue-700 mb-3 mt-4"
            {...props}
          />
        ),
        h2: ({ node, ...props }) => (
          <h2
            className="text-xl font-semibold text-blue-600 mb-2 mt-3"
            {...props}
          />
        ),
        h3: ({ node, ...props }) => (
          <h3
            className="text-lg font-semibold text-blue-500 mb-2 mt-2"
            {...props}
          />
        ),
        p: ({ node, ...props }) => (
          <p className="mb-2 leading-relaxed" {...props} />
        ),
        ul: ({ node, ...props }) => (
          <ul className="list-disc pl-5 mb-2" {...props} />
        ),
        ol: ({ node, ...props }) => (
          <ol className="list-decimal pl-5 mb-2" {...props} />
        ),
        li: ({ node, ...props }) => <li className="mb-1" {...props} />,
        code: ({ node, inline, ...props }) =>
          inline ? (
            <code
              className="bg-gray-100 text-red-600 px-1 py-0.5 rounded-md text-sm"
              {...props}
            />
          ) : (
            <pre className="bg-gray-100 p-3 rounded-md overflow-x-auto text-sm mb-2">
              <code className="text-gray-800" {...props} />
            </pre>
          ),
        blockquote: ({ node, ...props }) => (
          <blockquote
            className="border-l-4 border-blue-500 pl-4 py-2 bg-blue-50 italic mb-2"
            {...props}
          />
        ),
        a: ({ node, ...props }) => (
          <a
            className="text-blue-600 hover:underline hover:text-blue-800"
>>>>>>> 8854e0c772d2ba22878b86a4d5517864963777dd
            target="_blank"
            rel="noopener noreferrer"
            {...props}
          />
        ),
<<<<<<< HEAD
        table: ({ ...props }) => (
          <div className="overflow-x-auto mb-2">
            <table
              className="w-full border-collapse border border-gray-200 rounded"
              {...props}
            />
          </div>
        ),
        th: ({ ...props }) => (
          <th
            className="border border-gray-200 p-2 bg-gray-100 font-semibold text-left"
            {...props}
          />
        ),
        td: ({ ...props }) => (
          <td className="border border-gray-200 p-2" {...props} />
        ),
        hr: ({ ...props }) => (
          <hr className="my-4 border-t border-gray-200" {...props} />
        ),
        img: ({ ...props }) => (
          <img
            className="max-w-full h-auto rounded-md my-2"
            alt={props.alt || ""}
            {...props}
          />
        ),
=======
        table: ({ node, ...props }) => (
          <table
            className="w-full border-collapse border border-gray-200 mb-2"
            {...props}
          />
        ),
        th: ({ node, ...props }) => (
          <th
            className="border border-gray-200 p-2 bg-gray-100 font-semibold"
            {...props}
          />
        ),
        td: ({ node, ...props }) => (
          <td className="border border-gray-200 p-2" {...props} />
        ),
>>>>>>> 8854e0c772d2ba22878b86a4d5517864963777dd
      }}
    >
      {children}
    </ReactMarkdown>
  );
};

export default CustomMarkdown;

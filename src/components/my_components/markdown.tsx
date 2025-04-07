import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const CustomMarkdown = ({ children }) => {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
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
            target="_blank"
            rel="noopener noreferrer"
            {...props}
          />
        ),
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
      }}
    >
      {children}
    </ReactMarkdown>
  );
};

export default CustomMarkdown;

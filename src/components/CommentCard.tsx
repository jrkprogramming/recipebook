import { useState } from "react";
import ReactMarkdown from "react-markdown";

type Comment = {
  id: string;
  title: string;
  content: string;
  // Other properties specific to your Comment type
};

export const CommentCard = ({
  comment,
  onDelete,
}: {
  comment: Comment;
  onDelete: () => void;
}) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(true);

  return (
    <div className="mt-5 rounded-lg bg-gray-100 shadow-lg">
      <div className="rounded bg-black p-3">
        <div
          className={`flex cursor-pointer items-center justify-between ${
            isExpanded ? "bg-gray-200" : ""
          }`}
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <div className="text-xl font-bold text-gray-800">{comment.title}</div>
          <svg
            className={`h-6 w-6 transform transition-transform ${
              isExpanded ? "rotate-180" : ""
            }`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
        {isExpanded && (
          <div className="mt-3 text-white">
            <ReactMarkdown>{comment.content}</ReactMarkdown>
          </div>
        )}
        <div className="mt-4 flex justify-end">
          <button
            className="btn-error btn bg-amber-400 px-4 py-2	"
            onClick={onDelete}
          >
            Delete Comment
          </button>
        </div>
      </div>
    </div>
  );
};

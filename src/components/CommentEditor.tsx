import { useState } from "react";

export const CommentEditor = ({
  onSave,
}: {
  onSave: (comment: { title: string; content: string }) => void;
}) => {
  const [content, setContent] = useState<string>("");
  const [title, setTitle] = useState<string>("");

  return (
    <div className="card mt-5 border border-gray-200 bg-base-100 shadow-xl">
      <div className="card-body">
        <h2 className="card-title">
          <input
            type="text"
            placeholder="Comment Title"
            className="input-primary input input-lg w-full font-bold"
            value={title}
            onChange={(e) => setTitle(e.currentTarget.value)}
          />
          <input
            type="text"
            placeholder="Comment Message"
            className="input-primary input input-lg w-full font-bold"
            value={content}
            onChange={(e) => setContent(e.currentTarget.value)}
          />
        </h2>
      </div>
      <div className="card-actions justify-end">
        <button
          onClick={() => {
            onSave({
              title,
              content: content,
            });
            setTitle("");
          }}
          className="btn-primary btn"
        >
          Save
        </button>
      </div>
    </div>
  );
};

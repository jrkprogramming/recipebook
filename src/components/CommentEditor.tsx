import { useState } from "react";

export const CommentEditor = ({
  onSave,
}: {
  onSave: (comment: { title: string; content: string }) => void;
}) => {
  const [content, setContent] = useState<string>("");
  const [title, setTitle] = useState<string>("");

  return (
    <div className="mt-5 rounded-lg bg-gray-100 shadow-lg">
      <div className="rounded bg-black p-3">
        <h2 className="mb-4 text-xl font-bold">Add Comment</h2>
        <input
          type="text"
          placeholder="Comment Title"
          className="input-primary input mb-4 border-slate-900"
          value={title}
          onChange={(e) => setTitle(e.currentTarget.value)}
        />
        <textarea
          placeholder="Comment Message"
          className="input-primary input mb-4 w-full border-slate-900"
          value={content}
          onChange={(e) => setContent(e.currentTarget.value)}
        ></textarea>
        <div className="flex justify-end">
          <button
            onClick={() => {
              onSave({
                title,
                content: content,
              });
              setTitle("");
              setContent("");
            }}
            className="btn-primary btn border-slate-900	bg-amber-400 text-black"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

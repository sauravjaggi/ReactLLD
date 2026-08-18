import { useState } from "react";
import "./index.css";

interface CommentInputProps {
  placeholder?: string;
  addComment: (comment: string, action: "Edit" | "Add", id?: string) => void;
  id?: string;
  text?: string;
  action?: "Edit" | "Add";
  callBack?: () => void;
}
const CommentInput = ({
  addComment,
  placeholder = "Add Comment",
  id,
  text = "",
  action = "Add",
  callBack,
}: CommentInputProps) => {
  const [comment, setComment] = useState<string>(text);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setComment(e.target.value);
  };

  const handleAddComment = () => {
    addComment(comment, action, id);
    if (callBack) callBack();

    setComment("");
  };
  return (
    <div className="comment-input">
      <input
        type="text"
        placeholder={placeholder}
        value={comment}
        onChange={handleInputChange}
      />
      <button onClick={handleAddComment}>
        {action === "Edit" ? "Save" : placeholder}
      </button>
    </div>
  );
};

export default CommentInput;

import { useState } from "react";
import { TextField, IconButton, InputAdornment } from "@mui/material";
import SendRoundedIcon from "@mui/icons-material/SendRounded";
import "./index.scss";

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

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleAddComment();
    }
  };

  const handleAddComment = () => {
    addComment(comment, action, id);
    if (callBack) callBack();

    setComment("");
  };
  return (
    <div className="comment-input">
      <TextField
        fullWidth
        size="small"
        variant="outlined"
        placeholder={placeholder}
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        onKeyDown={handleKeyDown}
        autoFocus={action === "Edit"}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                className="comment-input__send"
                size="small"
                color="primary"
                disabled={!comment.trim()}
                onClick={handleAddComment}
                aria-label={action === "Edit" ? "Save comment" : "Post comment"}
              >
                <SendRoundedIcon fontSize="small" />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
    </div>
  );
};

export default CommentInput;
